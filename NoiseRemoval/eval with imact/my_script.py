import pandas as pd


data = pd.read_json('kelani_valley_iam.json')
data_df = pd.DataFrame(data)
data_df_1 = data_df[['date', 'keyword', 'impact']]

data2 = pd.read_csv('actual-30.csv')
data2_df = pd.DataFrame(data2)

output = pd.DataFrame(columns=['Date', 'High', 'Low', 'Close', 'Volume', 'VolumeT'])
for index, row in data2_df.iterrows():
    for index_1, row_1 in data_df_1.iterrows():
        if row['Date'] == row_1['date'].strftime('%Y-%m-%d'):
            row['Close'] = row['Close'] + (row_1['impact'] / 100) * row['Close']
            output.loc[index] = row
        else:
            output.loc[index] = row

output.columns = ['Date', 'High', 'Low', 'Impact_Added', 'Volume', 'VolumeT']

print(output)




