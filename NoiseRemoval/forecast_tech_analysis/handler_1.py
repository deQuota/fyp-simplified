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
    raw_sigma_high = raw_data_df['High'].std()
    raw_sigma_low = raw_data_df['Low'].std()
    raw_sigma_volume = raw_data_df['Volume'].std()

    # add Gaussian filter to raw data
    gaussian_filtered_raw = filters.gaussian_filter1d(raw_data_df['Close'], raw_sigma)
    gaussian_filtered_raw_high = filters.gaussian_filter1d(raw_data_df['High'], raw_sigma_high)
    gaussian_filtered_raw_low = filters.gaussian_filter1d(raw_data_df['Low'], raw_sigma_low)
    gaussian_filtered_raw_volume = filters.gaussian_filter1d(raw_data_df['Volume'], raw_sigma_volume)

    gaussian_filtered_raw_df = pd.DataFrame(gaussian_filtered_raw.tolist(), columns=['Close'])
    gaussian_filtered_raw_df_high = pd.DataFrame(gaussian_filtered_raw_high.tolist(), columns=['High'])
    gaussian_filtered_raw_df_low = pd.DataFrame(gaussian_filtered_raw_low.tolist(), columns=['Low'])
    gaussian_filtered_raw_df_volume = pd.DataFrame(gaussian_filtered_raw_volume.tolist(), columns=['Volume'])

    raw_data_with_filter = pd.DataFrame(raw_data_df['Date'], columns=['Date']).join(
        gaussian_filtered_raw_df.join(
            gaussian_filtered_raw_df_high.join(
                gaussian_filtered_raw_df_low.join(
                    gaussian_filtered_raw_df_volume
                )
            )
        )
    )
    # pre-process data for fbprophet
    # fb_prophet_df = raw_data_with_filtered.filter(['Date', 'G_Filtered', 'Close'], axis=1)
    # fb_prophet_df.columns = ['ds', 'y', 'Close']
    # fb_prophet_df['y'] = np.log(fb_prophet_df['y'])
    #
    return raw_data_with_filter


def prophet_forecast(raw_data_with_filter: pd.DataFrame, num_days, seasonality=30):

    fb_prophet_df_close = raw_data_with_filter.filter(['Date', 'Close'], axis=1)
    fb_prophet_df_close.columns = ['ds', 'y']
    fb_prophet_df_close['y'] = np.log(fb_prophet_df_close['y'])
    model_close = Prophet()
    # fitting to the model
    model_close.add_seasonality(name='monthly', period=seasonality, fourier_order=10)
    model_close.fit(fb_prophet_df_close)

    # making future predictions
    future_close = model_close.make_future_dataframe(periods=num_days)

    forecast_close = model_close.predict(future_close)

    forecast_df_close = pd.DataFrame(forecast_close)

    forecast_output_df_ds = pd.DataFrame(forecast_df_close.ds)
    raw_sigma_close = np.exp(forecast_df_close['yhat']).std()
    forecast_output_df_close = pd.DataFrame(filters.gaussian_filter1d(
        np.exp(forecast_df_close.yhat), raw_sigma_close), columns=['yhat'])

    forecast_output_df_close = forecast_output_df_ds.join(forecast_output_df_close)
    forecast_output_df_close.columns = ['Date', 'Close']

    fb_prophet_df_high = raw_data_with_filter.filter(['Date', 'High'], axis=1)
    fb_prophet_df_high.columns = ['ds', 'y']
    fb_prophet_df_high['y'] = np.log(fb_prophet_df_high['y'])
    model_high = Prophet()
    # fitting to the model
    model_high.add_seasonality(name='monthly', period=seasonality, fourier_order=10)
    model_high.fit(fb_prophet_df_high)

    # making future predictions
    future_high = model_high.make_future_dataframe(periods=num_days)

    forecast_high = model_high.predict(future_high)

    forecast_df_high = pd.DataFrame(forecast_high)

    raw_sigma_high = np.exp(forecast_df_high['yhat']).std()
    forecast_output_df_high = pd.DataFrame(filters.gaussian_filter1d(
        np.exp(forecast_df_high.yhat), raw_sigma_high), columns=['yhat'])
    forecast_output_df_high.rename(columns={'yhat': 'High'}, inplace=True)

    fb_prophet_df_low = raw_data_with_filter.filter(['Date', 'Low'], axis=1)
    fb_prophet_df_low.columns = ['ds', 'y']
    fb_prophet_df_low['y'] = np.log(fb_prophet_df_low['y'])
    model_low = Prophet()
    # fitting to the model
    model_low.add_seasonality(name='monthly', period=seasonality, fourier_order=10)
    model_low.fit(fb_prophet_df_low)

    # making future predictions
    future_low = model_low.make_future_dataframe(periods=num_days)

    forecast_low = model_low.predict(future_low)

    forecast_df_low = pd.DataFrame(forecast_low)

    raw_sigma_low = np.exp(forecast_df_low['yhat']).std()
    forecast_output_df_low = pd.DataFrame(filters.gaussian_filter1d(np.exp(forecast_df_low.yhat),
                                                                    raw_sigma_low), columns=['yhat'])
    forecast_output_df_low.rename(columns={'yhat': 'Low'}, inplace=True)

    fb_prophet_df_volume = raw_data_with_filter.filter(['Date', 'Volume'], axis=1)
    fb_prophet_df_volume.columns = ['ds', 'y']
    fb_prophet_df_volume['y'] = np.log(fb_prophet_df_volume['y'])
    model_volume = Prophet()
    # fitting to the model
    model_volume.add_seasonality(name='monthly', period=seasonality, fourier_order=10)
    model_volume.fit(fb_prophet_df_volume)

    # making future predictions
    future_volume = model_volume.make_future_dataframe(periods=num_days)

    forecast_volume = model_volume.predict(future_volume)

    forecast_df_volume = pd.DataFrame(forecast_volume)
    forecast_output_df_volume = pd.DataFrame(np.exp(forecast_df_volume.yhat))
    forecast_output_df_volume.rename(columns={'yhat': 'Volume'}, inplace=True)


    # output forecast
    forecast_output_df = forecast_output_df_close.join(
        forecast_output_df_high.join(
            forecast_output_df_low.join(
                forecast_output_df_volume
            )
        )).tail(num_days)
    print(forecast_output_df)
    # return forecast_output_df

    plt.plot(forecast_output_df.Date, forecast_output_df.Close, label='Close', linewidth=0.7)
    plt.plot(forecast_output_df.Date, forecast_output_df.High, label='High', linewidth=0.7)
    plt.plot(forecast_output_df.Date, forecast_output_df.Low, label='Low', linewidth=0.7)
    plt.gcf().autofmt_xdate()
    plt.rcParams["figure.figsize"] = [12, 9]
    plt.xlabel('Timeline')
    plt.ylabel('Stock Price (Closing)')
    plt.title('Evaluation \nComparison (20 Days)')
    plt.legend()
    plt.show()
    return forecast_output_df


df = remove_noise_of_raw(read_csv('bogawanthalawa_1.csv'))
out_df = pd.DataFrame(prophet_forecast(df, 200, 30))
out_df.to_csv('all_forecasts.csv')
