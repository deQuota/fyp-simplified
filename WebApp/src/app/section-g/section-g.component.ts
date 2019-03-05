import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';

@Component({
  selector: 'app-section-g',
  templateUrl: './section-g.component.html',
  styleUrls: ['./section-g.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SectionGComponent implements OnInit {

@Input() fileKey: '';
  windowSize = 1;
  enable = false;
  loaded = false;
  chartistLineChart: any;
  data: any;
  processedChartData: any;
  dates: number[] = [];
  rsi: any[] = [];
  seventyLine: any[] = [];
  thirtyLine: any[] = [];
  overBought: any[] = [];
  overSold: any[] = [];

  options: any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [],
    showTitle: true,
    title: 'Relative Strength Index Analysis',
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
    this.rsi = [];
    this.overBought = [];
    this.overSold = [];
    this.thirtyLine =[];
    this.seventyLine = [];
    if (!this.loaded && event) {
      this.spinner.show();
      this.questionService.getRelStrIndex(this.windowSize, this.fileKey).subscribe(
        (res) => {
          this.data = res;
          console.log(res, '=================================')
          console.log(res[0]['SHORTNAME']+'-----------------------------------------')
          this.data.forEach((element) => {
            this.dates.push(new Date(element.Date).getTime());
            const responseMean = 'ADX_' + this.windowSize + '_14';
            this.rsi.push(element['RSI_' + this.windowSize]);
            this.seventyLine.push(0.7);
            this.thirtyLine.push(0.3);
            if(element['RSI_' + this.windowSize] > 0.7){
                this.overBought.push(element['RSI_' + this.windowSize]);
            }
            else{
              this.overBought.push(null);
            }
            if(element['RSI_' + this.windowSize] < 0.3){
                this.overSold.push(element['RSI_' + this.windowSize]);
            }
            else{
              this.overSold.push(null);
            }
           
            	
          });
          const data = {
            // A labels array that can contain any sort of values
            labels: this.dates,
            // Our series array that contains series objects or in this case series data arrays
            series: [
              this.rsi,
              this.overBought,
              this.overSold,
              this.seventyLine,
              this.thirtyLine
            

              
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
