import logging
import math
import json
from datetime import datetime
import pandas as pd
import numpy as np
import scipy.ndimage.filters as filters
import matplotlib.pyplot as plt
import boto3


from fbprophet import Prophet

import sklearn.metrics as skl


def read_csv(location):
    raw_data = pd.read_csv(location)
    raw_data_df = pd.DataFrame(raw_data)

    return raw_data_df


def remove_noise_of_raw(raw_data_df: pd.DataFrame):
    # sigma calculation for raw data
    raw_sigma = raw_data_df['Close'].std()

    # add Gaussian filter to raw data
    gaussian_filtered_raw = filters.gaussian_filter1d(raw_data_df['Close'], raw_sigma)

    gaussian_filtered_raw_df = pd.DataFrame(gaussian_filtered_raw.tolist(), columns=['G_Filtered'])

    raw_data_with_filtered = raw_data_df.join(gaussian_filtered_raw_df)

    # pre-process data for fbprophet
    fb_prophet_df = raw_data_with_filtered.filter(['Date', 'G_Filtered', 'Close'], axis=1)
    fb_prophet_df.columns = ['ds', 'y', 'Close']
    fb_prophet_df['y'] = np.log(fb_prophet_df['y'])

    return fb_prophet_df


def prophet_forecast(fb_prophet_df: pd.DataFrame, num_days):

    model = Prophet()
    # fitting to the model
    # check seasonality with forecast dates
    model.add_seasonality(name='monthly', period=30, fourier_order=10)
    model.fit(fb_prophet_df)

    # making future predictions
    future = model.make_future_dataframe(periods=num_days)

    forecast = model.predict(future)

    forecast_df = pd.DataFrame(forecast)

    forecast_output_df = pd.DataFrame(forecast_df.ds)
    forecast_output_df = forecast_output_df.join(np.exp(forecast_df.yhat))
    forecast_output_df.columns = ['Date', 'G_Forecast', ]

    # output forecast
    forecast_output_df = forecast_output_df.tail(num_days)
    # print(forecast_output_df)
    return forecast_output_df


def noise_removal_forecat(raw_data_df: pd.DataFrame, forecast_input_df: pd.DataFrame):

    raw_sigma = raw_data_df['Close'].std()

    gaussian_filtered_forecast = filters.gaussian_filter1d(forecast_input_df['G_Forecast'], raw_sigma)

    # gaussian_filtered_forecast = gaussian_filtered_forecast + 0.5

    gaussian_filtered_forecast_df = pd.DataFrame(gaussian_filtered_forecast.tolist(), columns=['G_Forecast_NR'])

    gaussian_filtered_forecast_df = forecast_input_df.reset_index().join(gaussian_filtered_forecast_df)

    # print(gaussian_filtered_forecast_df)
    return gaussian_filtered_forecast_df


def add_market_noise(noise_removed_raw_df: pd.DataFrame, fore_df_nr: pd.DataFrame, num_days):

    noise = noise_removed_raw_df.Close - np.exp(noise_removed_raw_df.y)

    # finding mean noise
    mean_noise = np.mean(noise)

    # calculating sigma for short period
    short_time_sigma = noise_removed_raw_df.tail(num_days)['Close'].std()


    # calculating Gaussian white noise

    white_noise = np.random.normal(mean_noise, short_time_sigma*0.25, fore_df_nr.G_Forecast_NR.shape)

    # adding noise to predicted
    market_noise_added = fore_df_nr.G_Forecast_NR + white_noise

    market_noise_added_df = pd.DataFrame(market_noise_added.tolist(), columns=['Market_Noise_Added_Forecast'])

    market_noise_added_df = fore_df_nr.reset_index().join(market_noise_added_df)

    return market_noise_added_df


def forecast_without_noise_filter(raw_data: pd.DataFrame, num_days):
    fb_prophet_df = raw_data.filter(['Date', 'Close'], axis=1)
    fb_prophet_df.columns = ['ds', 'y']
    fb_prophet_df['y'] = np.log(fb_prophet_df['y'])
    model = Prophet()
    # fitting to the model
    model.add_seasonality(name='monthly', period=30, fourier_order=10)
    model.fit(fb_prophet_df)


    # making future predictions
    future = model.make_future_dataframe(periods=num_days)

    forecast = model.predict(future)

    forecast_df = pd.DataFrame(forecast)

    forecast_output_df = pd.DataFrame(forecast_df.ds)
    forecast_output_df = forecast_output_df.join(np.exp(forecast_df.yhat))
    forecast_output_df.columns = ['Date', 'Normal_Forecast']

    # output forecast
    forecast_output_df = forecast_output_df.tail(num_days)
    # print(forecast_output_df)
    return forecast_output_df


def add_impact_to_forecast(event_set: pd.DataFrame, noise_filtered_forecast: pd.DataFrame):
    output_df = pd.DataFrame(columns=['index', 'Date', 'G_Forecast', 'G_Forecast_NR'])
    for index, row in noise_filtered_forecast.iterrows():
        for index_1, row_1 in event_set.iterrows():
            if row['Date'] == row_1['date'].strftime('%Y-%m-%d'):
                row['G_Forecast_NR'] = row['G_Forecast_NR'] + (row_1['impact'] / 100) * row['G_Forecast_NR']
                output_df.loc[index] = row
            else:
                output_df.loc[index] = row

    output_df.columns = ['index', 'Date', 'G_Forecast', 'Impact_Added']

    return output_df


def mean_absolute_percentage_error(y_true, y_pred):

    return np.mean(np.abs((y_true - y_pred) / y_true))


def on_request(event, context):

    print('new request arrived')
    num_days = int(event['queryStringParameters']['num_days'])
    df_0 = read_csv('https://s3.amazonaws.com/pythonpackages-3.6/company_history.csv')
    df = remove_noise_of_raw(df_0)
    fore_df = prophet_forecast(df[:-num_days], num_days)

    fore_df_nr = noise_removal_forecat(df_0, fore_df)
    noise_added_forecast = add_market_noise(df, fore_df_nr, num_days)

    actual_df = df_0[-num_days:]
    actual_df = pd.DataFrame(actual_df, columns=['Close'])

    event_set = pd.read_json('https://s3.amazonaws.com/pythonpackages-3.6/impacts.json')
    fore_df_nr['Date'] = pd.DataFrame(df_0[-num_days:]['Date'], columns=['Date']).reset_index(drop=True)
    impact_added_forecast = add_impact_to_forecast(event_set, fore_df_nr)

    actual_df = actual_df.join(fore_df_nr)

    fore_df_without_nr = forecast_without_noise_filter(df_0, num_days)

    l_forecast = pd.DataFrame(impact_added_forecast['Impact_Added'], columns=['Impact_Added']).reset_index(drop=True)
    n_forecast = pd.DataFrame(fore_df_without_nr['Normal_Forecast'], columns=['Normal_Forecast']).reset_index(drop=True)
    g_forecast = pd.DataFrame(fore_df['G_Forecast'], columns=['G_Forecast']).reset_index(drop=True)
    g_forecast_nr = pd.DataFrame(fore_df_nr['G_Forecast_NR'], columns=['G_Forecast_NR']).reset_index(drop=True)
    mnaf = pd.DataFrame(noise_added_forecast['Market_Noise_Added_Forecast'],
                        columns=['Market_Noise_Added_Forecast']).reset_index(drop=True)
    act_close = pd.DataFrame(actual_df['Close'], columns=['Close']).reset_index(drop=True)
    date = pd.DataFrame(df_0[-num_days:]['Date'], columns=['Date']).reset_index(drop=True)

    all_df = n_forecast.join(g_forecast.join(g_forecast_nr.join(mnaf.join(act_close.join(l_forecast.join(date))))))
    # all_df['Date'] = pd.to_datetime(all_df['Date'], unit='s')
    # print(all_df.eval('G_Forecast - G_Forecast_NR'))
    mape = {}
    mape['G_Forecast'] = mean_absolute_percentage_error(act_close['Close'], g_forecast['G_Forecast'])
    mape['G_Forecast_NR'] =  mean_absolute_percentage_error(act_close['Close'], g_forecast_nr['G_Forecast_NR'])
    mape['Market_Noise_Added_Forecast'] = mean_absolute_percentage_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'])
    mape['Impact_Added'] =  mean_absolute_percentage_error(act_close['Close'], impact_added_forecast['Impact_Added'])
    mape['Normal_Forecast'] = mean_absolute_percentage_error(act_close['Close'], n_forecast['Normal_Forecast'])
    mape_json = json.dumps(mape)
    
    mae = {}
    mae['G_Forecast'] = skl.mean_absolute_error(act_close['Close'], g_forecast['G_Forecast'])
    mae['G_Forecast_NR'] =  skl.mean_absolute_error(act_close['Close'], g_forecast_nr['G_Forecast_NR'])
    mae['Market_Noise_Added_Forecast'] = skl.mean_absolute_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'])
    mae['Impact_Added'] =  skl.mean_absolute_error(act_close['Close'], impact_added_forecast['Impact_Added'])
    mae['Normal_Forecast'] = skl.mean_absolute_error(act_close['Close'], n_forecast['Normal_Forecast'])
    mae_json = json.dumps(mae)

    mse = {}
    mse['G_Forecast'] = skl.mean_squared_error(act_close['Close'], g_forecast['G_Forecast'])
    mse['G_Forecast_NR'] =  skl.mean_squared_error(act_close['Close'], g_forecast_nr['G_Forecast_NR'])
    mse['Market_Noise_Added_Forecast'] = skl.mean_squared_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'])
    mse['Impact_Added'] =  skl.mean_squared_error(act_close['Close'], impact_added_forecast['Impact_Added'])
    mse['Normal_Forecast'] = skl.mean_squared_error(act_close['Close'], n_forecast['Normal_Forecast'])
    mse_json = json.dumps(mse)

    msle = {}
    msle['G_Forecast'] = skl.mean_squared_log_error(act_close['Close'], g_forecast['G_Forecast'])
    msle['G_Forecast_NR'] =  skl.mean_squared_log_error(act_close['Close'], g_forecast_nr['G_Forecast_NR'])
    msle['Market_Noise_Added_Forecast'] = skl.mean_squared_log_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'])
    msle['Impact_Added'] =  skl.mean_squared_log_error(act_close['Close'], impact_added_forecast['Impact_Added'])
    msle['Normal_Forecast'] = skl.mean_squared_log_error(act_close['Close'], n_forecast['Normal_Forecast'])
    msle_json = json.dumps(msle)
    # print('MASE')
    # print(np.sqrt(((g_forecast['G_Forecast':] - act_close['Close']) ** 2).mean()))
    # print(np.sqrt(((g_forecast_nr['G_Forecast_NR'] - act_close['Close']) ** 2).mean()))
    # print(np.sqrt(((noise_added_forecast['Market_Noise_Added_Forecast'] - act_close['Close']) ** 2).mean()))
    # print(np.sqrt(((impact_added_forecast['Impact_Added'] - act_close['Close']) ** 2).mean()))
    # print(np.sqrt(((n_forecast['Normal_Forecast'] - act_close['Close']) ** 2).mean()))

    # print('R^2')
    # print(skl.r2_score(act_close['Close'], g_forecast['G_Forecast'], multioutput='variance_weighted'))
    # print(skl.r2_score(act_close['Close'], g_forecast_nr['G_Forecast_NR'], multioutput='variance_weighted'))
    # print(skl.r2_score(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'],
    #                    multioutput='variance_weighted'))
    # print(skl.r2_score(act_close['Close'], impact_added_forecast['Impact_Added'], multioutput='variance_weighted'))
    # print(skl.r2_score(act_close['Close'], n_forecast['Normal_Forecast'], multioutput='variance_weighted'))

    print('MAPE')
    print(mape)
    
    print('MSE')
    print(mse)

    
    print('MAE')
    print(mae)

    print('MSLE')
    print(msle)
    try:
        s3_resource = boto3.resource('s3')
        s3_resource.Object('pythonpackages-3.6', 'evaluations/mape.json').put(Body=mape_json)
        s3_resource.Object('pythonpackages-3.6', 'evaluations/mse.json').put(Body=mse_json)
        s3_resource.Object('pythonpackages-3.6', 'evaluations/mae.json').put(Body=mae_json)
        s3_resource.Object('pythonpackages-3.6', 'evaluations/msle.json').put(Body=msle_json)
        print('Uploaded')
        
    except BaseException as e:
        print('Upload error')
        print(str(e))

    # print(all_df)
    # all_df = fore_df['G_Forecast'].join(fore_df_nr['G_Forecast_NR'].join(noise_added_forecast['Market_Noise_Added_Forecast'].join(actual_df['Close'])))
    #
    # all_df.to_csv('all.csv')

    # print(fore_df)
    # print(fore_df_nr)
    # print(noise_added_forecast)
    # print(actual_df)

    # plt.plot(all_df.Date, all_df.G_Forecast, label='F_Gausian', linewidth=0.7)
    # plt.plot(all_df.Date, all_df.G_Forecast_NR, label='F_Gausian_NR', linewidth=0.7)
    # plt.plot(all_df.Date, all_df.Market_Noise_Added_Forecast, label='Market_Noise_Added_Forecast', linewidth=0.7)
    # plt.plot(all_df.Date, all_df.Close, label='Actual', linewidth=0.7)
    # plt.plot(all_df.Date, all_df.Normal_Forecast, label='Pred. with raw', linewidth=0.7)
    # plt.plot(all_df.Date, all_df.Impact_Added, label='F_Impact_Added', linewidth=0.7)
    # plt.gcf().autofmt_xdate()
    # plt.rcParams["figure.figsize"] = [12, 9]
    # plt.xlabel('Timeline')
    # plt.ylabel('Stock Price (Closing)')
    # plt.title('Evaluation \nComparison (20 Days)')
    # plt.legend()
    # plt.show()
    #
    # print(df[:-num_days])
    # print()
    # print(df[-num_days:])
    # print()
    # print(df_0[-num_days:])

    response = {
        "statusCode": 200,
        "body": all_df.to_json(orient='records', date_unit='ms')
    }

    return response
