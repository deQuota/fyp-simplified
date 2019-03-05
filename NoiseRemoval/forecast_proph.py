import pandas as pd
import numpy as np

from fbprophet import Prophet
import matplotlib.pyplot as plts
import scipy.ndimage.filters as filters

df_whole = pd.read_csv('gaussian.csv')

df = df_whole.filter(['Date', 'Gaus'], axis=1)

df.columns = ['ds', 'y']
df['y'] = np.log(df['y'])

m = Prophet()
m.fit(df)

num_days = 100
future = m.make_future_dataframe(periods=num_days)
forecast = m.predict(future)
forecast_df = pd.DataFrame(forecast)
# print(np.exp(forecast_df.yhat))
yhat_df = pd.DataFrame(forecast_df.yhat)
yhat_df = yhat_df.join(forecast_df.ds)
# print(yhat_df)

true_forecast = pd.DataFrame(forecast.tail(100)).reset_index()
gau1_d = filters.gaussian_filter1d(true_forecast['yhat'], 4) #find a dynamic method to input as deviation
gau1_d_df = pd.DataFrame(np.exp(gau1_d.tolist()), columns=['Gaussian'])
print(gau1_d_df)

appended = true_forecast.join(gau1_d_df)
print(appended)

# forecast_df.to_csv('forecast_prophet.csv')
# print(forecast_df)
#
# plt = m.plot(forecast)
# plt.show()
#
# # plt = m.plot_components(forecast)
# plt.waitforbuttonpress()
# # plt.show()
# plts.plot(appended.ds, np.exp(appended.yhat), label='Actual Gau', linewidth=0.7)
# plts.plot(appended.ds, appended.Gaussian, label='Predicted Gau', linewidth=0.7)
plts.plot(forecast_df.ds, np.exp(forecast_df.yhat), label='Pred', linewidth=0.7)

plts.xlabel('Timeline')
plts.ylabel('Stock Price (Closing)')
plts.title('Predictions \n from fbprophet')
plts.legend()
plts.show()