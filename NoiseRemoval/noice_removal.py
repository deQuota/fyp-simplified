import logging
import math

# Import Third-Party
import pandas as pd
import numpy as np
import scipy.ndimage.filters as filters
import matplotlib.pyplot as plt

log = logging.getLogger(__name__)

#data = pd.read_csv('WatawalaPlantations.csv')
data = pd.read_csv('WatawalaPlantations2015.csv')
df = pd.DataFrame(data)
std = df.std()
print(std)

gau1_d = filters.gaussian_filter1d(df['Close'], 4.838936)
print(gau1_d.tolist())
gau1_ddf = pd.DataFrame(gau1_d.tolist(), columns=['Gaus'])

appended = df.join(gau1_ddf)
print(appended)


# std = standard_deviation(data, 2)
# print(std)
moving = moving_average(data,20)
expMoving = exponential_moving_average(data,20)
# print(moving)
# print(expMoving)
# moving.to_csv('moving.csv')
# moving = pd.read_csv('moving.csv')
# plt.xticks(rotation=-90)
#
#
plt.plot(data.Date, data.Close, label='Actual', linewidth=1.0)
# plt.plot(data.Date, std.STD_2, label='STD')
plt.plot(data.Date, moving.MA_20, label='Moving', linewidth=0.7)
plt.plot(data.Date, expMoving.EMA_20, label='Ex-Moving', linewidth=0.7)
plt.plot(data.Date, gau1_ddf.Gaus, label='Gausian', linewidth=0.7)

plt.xlabel('Timeline')
plt.ylabel('Stock Price (Closing)')
plt.title('Noise Removal\nComparison')
plt.legend()
plt.show()
