import logging
import math

import pandas as pd
import numpy as np
import scipy.ndimage.filters as filters
import matplotlib.pyplot as plt


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



def mean_absolute_percentage_error(y_true, y_pred):

    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


num_days = 66


df = remove_noise_of_raw(read_csv('namunukula.csv'))
fore_df: pd.DataFrame = prophet_forecast(df, num_days)

fore_df_nr: pd.DataFrame = noise_removal_forecat(read_csv('namunukula.csv'), fore_df)
noise_added_forecast: pd.DataFrame = add_market_noise(df, fore_df_nr, num_days)

actual_df = pd.read_csv('actual-30.csv')
actual_df = actual_df['Close']
actual_df = pd.DataFrame(actual_df, columns=['Close'])


actual_df: pd.DataFrame = actual_df.join(fore_df_nr)

fore_df_without_nr = forecast_without_noise_filter(read_csv('namunukula.csv'), num_days)

n_forecast = pd.DataFrame(fore_df_without_nr['Normal_Forecast'], columns=['Normal_Forecast']).reset_index(drop=True)
g_forecast = pd.DataFrame(fore_df['G_Forecast'], columns=['G_Forecast']).reset_index(drop=True)
g_forecast_nr = pd.DataFrame(fore_df_nr['G_Forecast_NR'], columns=['G_Forecast_NR']).reset_index(drop=True)
mnaf = pd.DataFrame(noise_added_forecast['Market_Noise_Added_Forecast'], columns=['Market_Noise_Added_Forecast']).reset_index(drop=True)
act_close = pd.DataFrame(actual_df['Close'], columns=['Close']).reset_index(drop=True)
date = pd.DataFrame(fore_df_nr['Date'], columns=['Date']).reset_index(drop=True)

all_df = n_forecast.join(g_forecast.join(g_forecast_nr.join(mnaf.join(act_close.join(date)))))
all_df['Close'].values


# print(all_df.eval('G_Forecast - G_Forecast_NR'))
print('MASE')
print(np.sqrt(((g_forecast['G_Forecast'] - act_close['Close']) ** 2).mean()))
print(np.sqrt(((g_forecast_nr['G_Forecast_NR'] - act_close['Close']) ** 2).mean()))
print(np.sqrt(((noise_added_forecast['Market_Noise_Added_Forecast'] - act_close['Close']) ** 2).mean()))
print(np.sqrt(((n_forecast['Normal_Forecast'] - act_close['Close']) ** 2).mean()))


print('R^2')
print(skl.r2_score(act_close['Close'], g_forecast['G_Forecast'], multioutput='variance_weighted'))
print(skl.r2_score(act_close['Close'], g_forecast_nr['G_Forecast_NR'], multioutput='variance_weighted'))
print(skl.r2_score(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast'], multioutput='variance_weighted'))
print(skl.r2_score(act_close['Close'], n_forecast['Normal_Forecast'], multioutput='variance_weighted'))

print('MAPE')
print(mean_absolute_percentage_error(act_close['Close'], g_forecast['G_Forecast']))
print(mean_absolute_percentage_error(act_close['Close'], g_forecast_nr['G_Forecast_NR']))
print(mean_absolute_percentage_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast']))
print(mean_absolute_percentage_error(act_close['Close'], n_forecast['Normal_Forecast']))

print('MASE')

print(skl.mean_squared_error(act_close['Close'], g_forecast['G_Forecast']))
print(skl.mean_squared_error(act_close['Close'], g_forecast_nr['G_Forecast_NR']))
print(skl.mean_squared_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast']))
print(skl.mean_squared_error(act_close['Close'], n_forecast['Normal_Forecast']))

print('MAE')

print(skl.mean_absolute_error(act_close['Close'], g_forecast['G_Forecast']))
print(skl.mean_absolute_error(act_close['Close'], g_forecast_nr['G_Forecast_NR']))
print(skl.mean_absolute_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast']))
print(skl.mean_absolute_error(act_close['Close'], n_forecast['Normal_Forecast']))

print('MSLE')

print(skl.mean_squared_log_error(act_close['Close'], g_forecast['G_Forecast']))
print(skl.mean_squared_log_error(act_close['Close'], g_forecast_nr['G_Forecast_NR']))
print(skl.mean_squared_log_error(act_close['Close'], noise_added_forecast['Market_Noise_Added_Forecast']))
print(skl.mean_squared_log_error(act_close['Close'], n_forecast['Normal_Forecast']))


# print(all_df)
# all_df = fore_df['G_Forecast'].join(fore_df_nr['G_Forecast_NR'].join(noise_added_forecast['Market_Noise_Added_Forecast'].join(actual_df['Close'])))
#
# all_df.to_csv('all.csv')

# print(fore_df)
# print(fore_df_nr)
# print(noise_added_forecast)
# print(actual_df)



plt.plot(all_df.Date, all_df.G_Forecast, label='F_Gausian', linewidth=0.7)
plt.plot(all_df.Date, all_df.G_Forecast_NR, label='F_Gausian_NR', linewidth=0.7)
plt.plot(all_df.Date, all_df.Market_Noise_Added_Forecast, label='Market_Noise_Added_Forecast', linewidth=0.7)
plt.plot(all_df.Date, all_df.Close, label='Actual', linewidth=0.7)
plt.plot(all_df.Date, all_df.Normal_Forecast, label='Pred. with raw', linewidth=0.7)
plt.gcf().autofmt_xdate()
plt.rcParams["figure.figsize"] = [12, 9]
plt.xlabel('Timeline')
plt.ylabel('Stock Price (Closing)')
plt.title('Evaluation \nComparison (20 Days)')
plt.legend()
plt.show()

