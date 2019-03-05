import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable()

export class QuestionService {


  constructor(private http: HttpClient) {

  }
  uploadfile(file) {
  	return new Promise((resolve, reject) => {
      const bucket = new S3(
      {
        accessKeyId: 'AKIAIMJZHC6QTJTZCMYQ',
        secretAccessKey: '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',
        region: 'us-east-1'
      }
    );
 
    const params = {
      Bucket: 'pythonpackages-3.6',
      Key: file.name,
      Body: file
    };
     let uploaded = false;
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        reject({status: false});
        return false;

      }
 
      console.log('Successfully uploaded file.', data);
      uploaded = true;
      resolve({status: true,data: data});
      return true;
      
     
   
    });
    
    });
  }
   
  getMeanAverage(windowSize: number, fileKey: string) {
    return this.http.get<any>('https://2zfg5qz6i2.execute-api.us-east-1.amazonaws.com/default/pythonSecond?windowSize=' + windowSize+ '&fileKey=' + fileKey);
  }

  getOBAverage(windowSize: number, fileKey: string){
    return this.http.get<any>('https://6w6uuia4kc.execute-api.us-east-1.amazonaws.com/default/pythonThirdObVolume?windowSize=' + windowSize+ '&fileKey=' + fileKey);
  }

  getAdLine(windowSize: number, fileKey: string){
    return this.http.get<any>('https://bshpz0ugii.execute-api.us-east-1.amazonaws.com/default/pythonFourthAdLine?windowSize=' + windowSize+ '&fileKey=' + fileKey);
  }

  getADIndex(windowSize: number, fileKey: string, n_ADX: number){
    return this.http.get<any>('https://sy409ypaf2.execute-api.us-east-1.amazonaws.com/default/pythonFourthavgDirectionalIndex?windowSize=' + windowSize+ '&fileKey=' + fileKey + '&n_ADX=' + n_ADX);
  }

  getMACD(windowSize: number, fileKey: string, n_fast: number, n_slow: number){
    return this.http.get<any>('https://z31znmt91a.execute-api.us-east-1.amazonaws.com/default/pythonFifthMACD?windowSize=' + windowSize+ '&fileKey=' + fileKey + '&n_fast=' + n_fast + '&n_slow=' + n_slow);
  }

  getStoOcil(windowSize: number, fileKey: string){
    return this.http.get<any>('https://ymvl4dmaed.execute-api.us-east-1.amazonaws.com/default/pythonSeventhStoOscill?windowSize=' + windowSize+ '&fileKey=' + fileKey);
  }

  getRelStrIndex(windowSize: number, fileKey: string){
    return this.http.get<any>('https://z6jyuyxw4i.execute-api.us-east-1.amazonaws.com/default/pythonSixthRelStrIndex?windowSize=' + windowSize+ '&fileKey=' + fileKey);
  }

  getForecast(num_days: number){
    return this.http.get<any>('http://localhost:3000/forecast?num_days=' + num_days)
    // return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/dev_forecast.json');
  }

  getForecast_all(num_days: number, seasonality: number){
    return this.http.get<any>('http://localhost:3000/forecast_all?num_days='+ num_days +'&seasonality=' + seasonality)
  }

  getEvalMAE(){
    return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/evaluations/mae.json');
  }

  getEvalMAPE(){
    return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/evaluations/mape.json')
  }

  getEvalMSE(){
    return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/evaluations/mse.json')
  }

  getEvalMSLE(){
    return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/evaluations/msle.json')
  }

  getImpacts(){
    return this.http.get<any>('https://s3.amazonaws.com/pythonpackages-3.6/impacts.json')
  }



}
