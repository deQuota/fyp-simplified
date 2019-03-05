import json
import csv
import numpy as np
import pandas as pd


def hello(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = moving_average(data, int(windowSize))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """


def obVolume(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = on_balance_volume(data, int(windowSize))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response


def adLine(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = accumulation_distribution(data, int(windowSize))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response

def avgDirectionalIndex(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    n_ADX = event['queryStringParameters']['n_ADX']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = average_directional_movement_index(data, int(windowSize), int(n_ADX))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response


def macd_cal(event, context):
    n_fast = event['queryStringParameters']['n_fast']
    fileKey = event['queryStringParameters']['fileKey']
    n_slow = event['queryStringParameters']['n_slow']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = macd(data, int(n_fast), int(n_slow))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response


def relStrIndex(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = relative_strength_index(data, int(windowSize))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response

def stoOscillK_d(event, context):
    windowSize = event['queryStringParameters']['windowSize']
    fileKey = event['queryStringParameters']['fileKey']
    data = pd.read_csv('https://s3.amazonaws.com/pythonpackages-3.6/'+ fileKey)
    moving = stochastic_oscillator_d(data, int(windowSize))

    response = {
        "statusCode": 200,
        "body": moving.to_json(orient='records')
    }

    return response




def moving_average(df, n):
    
    MA = pd.Series(df['Close'].rolling(n, min_periods=n).mean(), name='MA_' + str(n))
    df = df.join(MA)
    return df

def on_balance_volume(df, n):
    
    i = 0
    OBV = [0]
    while i < df.index[-1]:
        if df.loc[i + 1, 'Close'] - df.loc[i, 'Close'] > 0:
            OBV.append(df.loc[i + 1, 'Volume'])
        if df.loc[i + 1, 'Close'] - df.loc[i, 'Close'] == 0:
            OBV.append(0)
        if df.loc[i + 1, 'Close'] - df.loc[i, 'Close'] < 0:
            OBV.append(-df.loc[i + 1, 'Volume'])
        i = i + 1
    OBV = pd.Series(OBV)
    OBV_ma = pd.Series(OBV.rolling(n, min_periods=n).mean(), name='OBV_' + str(n))
    df = df.join(OBV_ma)
    return df



def accumulation_distribution(df, n):
    
    ad = (2 * df['Close'] - df['High'] - df['Low']) / (df['High'] - df['Low']) * df['Volume']
    M = ad.diff(n - 1)
    N = ad.shift(n - 1)
    ROC = M / N
    AD = pd.Series(ROC, name='Acc/Dist_ROC_' + str(n))
    df = df.join(AD)
    return df


def average_directional_movement_index(df, n, n_ADX):
    
    i = 0
    UpI = []
    DoI = []
    while i + 1 <= df.index[-1]:
        UpMove = df.loc[i + 1, 'High'] - df.loc[i, 'High']
        DoMove = df.loc[i, 'Low'] - df.loc[i + 1, 'Low']
        if UpMove > DoMove and UpMove > 0:
            UpD = UpMove
        else:
            UpD = 0
        UpI.append(UpD)
        if DoMove > UpMove and DoMove > 0:
            DoD = DoMove
        else:
            DoD = 0
        DoI.append(DoD)
        i = i + 1
    i = 0
    TR_l = [0]
    while i < df.index[-1]:
        TR = max(df.loc[i + 1, 'High'], df.loc[i, 'Close']) - min(df.loc[i + 1, 'Low'], df.loc[i, 'Close'])
        TR_l.append(TR)
        i = i + 1
    TR_s = pd.Series(TR_l)
    ATR = pd.Series(TR_s.ewm(span=n, min_periods=n).mean())
    UpI = pd.Series(UpI)
    DoI = pd.Series(DoI)
    PosDI = pd.Series((UpI.ewm(span=n, min_periods=n).mean() / ATR), name='PosDI')
    NegDI = pd.Series((DoI.ewm(span=n, min_periods=n).mean() / ATR), name='NegDI')
    ADX = pd.Series((abs(PosDI - NegDI) / (PosDI + NegDI)).ewm(span=n_ADX, min_periods=n_ADX).mean(),
                    name='ADX_' + str(n) + '_' + str(n_ADX))
    df = df.join(ADX)
    df = df.join(PosDI)
    df = df.join(NegDI)
    return df

def macd(df, n_fast, n_slow):
    
    EMAfast = pd.Series(df['Close'].ewm(span=n_fast, min_periods=n_slow).mean())
    EMAslow = pd.Series(df['Close'].ewm(span=n_slow, min_periods=n_slow).mean())
    MACD = pd.Series(EMAfast - EMAslow, name='MACD_' + str(n_fast) + '_' + str(n_slow))
    MACDsign = pd.Series(MACD.ewm(span=9, min_periods=9).mean(), name='MACDsign_' + str(n_fast) + '_' + str(n_slow))
    MACDdiff = pd.Series(MACD - MACDsign, name='MACDdiff_' + str(n_fast) + '_' + str(n_slow))
    df = df.join(MACD)
    df = df.join(MACDsign)
    df = df.join(MACDdiff)
    return df

def relative_strength_index(df, n):
   
    i = 0
    UpI = [0]
    DoI = [0]
    while i + 1 <= df.index[-1]:
        UpMove = df.loc[i + 1, 'High'] - df.loc[i, 'High']
        DoMove = df.loc[i, 'Low'] - df.loc[i + 1, 'Low']
        if UpMove > DoMove and UpMove > 0:
            UpD = UpMove
        else:
            UpD = 0
        UpI.append(UpD)
        if DoMove > UpMove and DoMove > 0:
            DoD = DoMove
        else:
            DoD = 0
        DoI.append(DoD)
        i = i + 1
    UpI = pd.Series(UpI)
    DoI = pd.Series(DoI)
    PosDI = pd.Series(UpI.ewm(span=n, min_periods=n).mean())
    NegDI = pd.Series(DoI.ewm(span=n, min_periods=n).mean())
    RSI = pd.Series(PosDI / (PosDI + NegDI), name='RSI_' + str(n))
    df = df.join(RSI)
    return df


def stochastic_oscillator_d(df, n):
    
    SOk = pd.Series((df['Close'] - df['Low']) / (df['High'] - df['Low']), name='SO%k')
    df = df.join(SOk)
    SOd = pd.Series(SOk.ewm(span=n, min_periods=n).mean(), name='SO%d_' + str(n))
    df = df.join(SOd)
    return df