import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';

@Component({
  selector: 'app-section-f',
  templateUrl: './section-f.component.html',
  styleUrls: ['./section-f.component.css']
})
export class SectionFComponent implements OnInit {

 @Input() fileKey: '';
  windowSize = 1;
  enable = false;
  loaded = false;
  chartistLineChart: any;
  data: any;
  processedChartData: any;
  dates: number[] = [];
  soD: any[] = [];
  soK: any[] = [];
  overBoughtLine: any[] = [];
  overSoldLine: any[] = [];
  overBought: any[] = [];
  overSold: any[] = [];

  options: any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [],
    showTitle: true,
    title: 'Stochastic Oscillator Analysis',
    useBom: true,
    removeNewLines: false,
    keys: []
  };
  

  constructor(
  	private questionService: QuestionService,
    private spinnerService: Ng4LoadingSpinnerService,
    private spinner: NgxSpinnerService
    ) { }
  ngOnInit() {
  }

  onChange(event) {
    console.log(event);
    this.enable = event;
    this.loaded = false;
    this.dates = [];
    this.soK = [];
    this.soD = [];
    this.overBoughtLine = [];
    this.overSoldLine = [];
    this.overBought = [];
    this.overSold = [];
    if (!this.loaded && event) {
      this.spinner.show();
      this.questionService.getStoOcil(this.windowSize, this.fileKey).subscribe(
        (res) => {
          this.data = res;
          console.log(res, '=================================')
          console.log(res[0]['SHORTNAME']+'-----------------------------------------')
          this.data.forEach((element) => {
            this.dates.push(new Date(element.Date).getTime());
            const responseMean = 'ADX_' + this.windowSize + '_14';
            this.soD.push(element['SO%d_' + this.windowSize]);
            this.soK.push(element['SO%k']);
            this.overBoughtLine.push(0.8);
            this.overSoldLine.push(0.2);
            if(element['SO%k'] >= 0.8){ 
            	this.overBought.push(element['SO%k']); 
            }else {
             this.overBought.push(null);
          	}
           	if (element['SO%k'] <= 0.2) { 
           	 this.overSold.push(element['SO%k']);
           	}
           	else {
           		this.overSold.push(null)
           	}
            	
          });
          const data = {
            // A labels array that can contain any sort of values
            labels: this.dates,
            // Our series array that contains series objects or in this case series data arrays
            series: [
              this.soD,
              this.soK,
              this.overBoughtLine,
              this.overSoldLine,
              this.overBought,
              this.overSold

              
            ]
          };
          this.processedChartData = data;
          this.spinner.hide();
          this.loaded = true;
        }
      );
    } else {
      this.loaded = true;
    }
  }


}
