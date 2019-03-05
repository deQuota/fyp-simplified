import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';


@Component({
  selector: 'app-forecasting-tool',
  templateUrl: './forecasting-tool.component.html',
  styleUrls: ['./forecasting-tool.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForecastingToolComponent implements OnInit {
 start_date: number;
 end_date: number;
 impact_data = [];
 long_forecast_ongoing = false;
 button_status = 'Move to Tech. Analysis with long term forecast';
 long_seasonality = 365;
 long_days = 100;
 loaded = false;
 chartData: any;
 Normal_Forecast= [];
 G_Forecast= [];
 G_Forecast_NR= [];
 Market_Noise_Added_Forecast= [];
 Close= [];
 Impact_Added= [];
 Date= [];
 data = [];


 evalMAE = [];
 evalMAPE = [];
 evalMSE = [];
 evalMSLE =[];



 num_days = 30;
 relativePath = 'Drop files here';
 uploaded = false;
 buttonStatus = 'Upload';
 fileKey = '';
 selectedFile: File;
 public files: UploadFile[] = [];
  constructor( 
    private questionService: QuestionService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  ngOnInit() {
    
  }
  async upload() {
    this.buttonStatus = 'Uploading...';
    this.spinner.show();
    const file = this.selectedFile;
    await this.questionService.uploadfile(file).then((res) => {
      this.uploaded = res['status']; this.spinner.hide()
      this.fileKey = res['data']['Key'];
      this.sliderChnage();  
      this.uploaded = true;
    });
  }
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          this.relativePath = droppedFile.relativePath;
          this.selectedFile = file;
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

  onChange(event) {
    this.sliderChnage();
  }
  async sliderChnage(){
    this.spinner.show()
    this.loaded = false;
    this.Normal_Forecast= [];
    this.G_Forecast= [];
    this.G_Forecast_NR= [];
    this.Market_Noise_Added_Forecast= [];
    this.Close= [];
    this.Impact_Added= [];
    this.Date= [];

    this.evalMAE = [];
    this.evalMAPE = [];
    this.evalMSE = [];
    this.evalMSLE =[];

    this.questionService.getForecast(this.num_days).subscribe(
      async (res) => {
        console.log(res)
        this.data = res;
        this.data.forEach((element) => {
          this.Date.push(element.Date);
          this.Normal_Forecast.push(element.Normal_Forecast);
          this.G_Forecast.push(element.G_Forecast);
          this.G_Forecast_NR.push(element.G_Forecast_NR);
          this.Market_Noise_Added_Forecast.push(element.Market_Noise_Added_Forecast);
          this.Close.push(element.Close);
          this.Impact_Added.push(element.Impact_Added);
        }
        );
        this.start_date = new Date(this.Date[0]).getTime();
        this.end_date = new Date(this.Date[this.Date.length - 1]).getTime();

        const data = {
            // A labels array that can contain any sort of values
            labels: this.Date,
            // Our series array that contains series objects or in this case series data arrays

            series: [
              // this.Normal_Forecast,
              // this.G_Forecast,
              // this.G_Forecast_NR,
              // this.Market_Noise_Added_Forecast,
              // this.Close,
              // this.Impact_Added
             { "name": "Normal Forecast - NF", "data": this.Normal_Forecast},
             { "name": "Guassian Forecast - GF", "data": this.G_Forecast},
             { "name": "Gaussian Forecast (noise removed) - GNRF", "data": this.G_Forecast_NR},
             { "name": "Gaussian Forecast (with market noise) - GMNF", "data": this.Market_Noise_Added_Forecast},
             { "name": "Actual Values - ACT", "data": this.Close},
             { "name": "Gaussian Forecast (Impact Added) - GIAF", "data": this.Impact_Added},

              
            ]
          };
    await this.getEvalMAE();
    
    await this.getEvalMAPE();
    
    await this.getEvalMSE();
    
    await this.getEvalMSLE();

    await this.getImpacts();
    

    this.loaded = true;
    this.chartData = data
    
    this.spinner.hide();
      },
      (err) => {
    this.spinner.hide();    

      }
      );

  }
  getEvalMAE(){
    return new Promise((resolve, reject) =>{
      this.questionService.getEvalMAE().subscribe(
     (res) =>{
         this.evalMAE.push(res.G_Forecast)
         this.evalMAE.push(res.G_Forecast_NR)
         this.evalMAE.push(res.Market_Noise_Added_Forecast)
         this.evalMAE.push(res.Impact_Added)
         this.evalMAE.push(res.Normal_Forecast)
         
         resolve();
        
 
    });

    })
  }
  getEvalMAPE(){
    return new Promise((resolve, reject) =>{
      this.questionService.getEvalMAPE().subscribe(
     (res) =>{
         this.evalMAPE.push(res.G_Forecast)
         this.evalMAPE.push(res.G_Forecast_NR)
         this.evalMAPE.push(res.Market_Noise_Added_Forecast)
         this.evalMAPE.push(res.Impact_Added)
         this.evalMAPE.push(res.Normal_Forecast)
         
         resolve();
        
 
    });

    })
  }
  getEvalMSE(){
    return new Promise((resolve, reject) =>{
      this.questionService.getEvalMSE().subscribe(
     (res) =>{
         this.evalMSE.push(res.G_Forecast)
         this.evalMSE.push(res.G_Forecast_NR)
         this.evalMSE.push(res.Market_Noise_Added_Forecast)
         this.evalMSE.push(res.Impact_Added)
         this.evalMSE.push(res.Normal_Forecast)
         
         resolve();
        
 
    });

    })
  }
  getEvalMSLE(){
    return new Promise((resolve, reject) =>{
      this.questionService.getEvalMSLE().subscribe(
     (res) =>{
         this.evalMSLE.push(res.G_Forecast)
         this.evalMSLE.push(res.G_Forecast_NR)
         this.evalMSLE.push(res.Market_Noise_Added_Forecast)
         this.evalMSLE.push(res.Impact_Added)
         this.evalMSLE.push(res.Normal_Forecast)
         
         resolve();
        
 
    });

    })
  }

  getImpacts(){
    this.impact_data = [];
    return new Promise((resolve, reject) => {
      this.questionService.getImpacts().subscribe(
          (res) =>{
            let impact_data = [];
            impact_data = res;
            impact_data.forEach((element) => {
              let out_format: any = {
                'date': element.date,
                'event': element.event,
                'impact': element.impact,
                'date_time': new Date(element.date).getTime()
              } 
           this.impact_data.push(out_format);
            });

            console.log(this.impact_data);
            console.log(this.start_date);
            console.log(this.end_date);
            resolve();
          }
        )
    })
  }

  doLongForecast(){
    this.button_status = 'please wait';
    this.long_forecast_ongoing = true;
    this.questionService.getForecast_all(this.long_days, this.long_seasonality).subscribe(
        (res) => {
          this.button_status = 'redirecting';
          this.long_forecast_ongoing = false;
          this.router.navigate(['/technicalAnalysis'])


        }
      );
  }
  removeImpact(date: string){
      let date_time = new Date(date).getTime()
    
      console.log(this.data.filter((item) =>{
        return item.Date === date_time
      }))
  }

}
