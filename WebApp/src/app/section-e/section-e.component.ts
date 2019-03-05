import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';
@Component({
  selector: 'app-section-e',
  templateUrl: './section-e.component.html',
  styleUrls: ['./section-e.component.css']
})
export class SectionEComponent implements OnInit {

  @Input() fileKey: '';
  windowSize = 1;
  n_fast = 1;
  n_slow = 1;
  enable = false;
  loaded = false;
  chartistLineChart: any;
  data: any;
  processedChartData: any;
  dates: number[] = [];
  MACD: any[] = [];
  MACDDIff: any[] = [];
  MACDSign: any[] = [];
  buy:any[] = [];
  zeroLine:any[] = [];

  options: any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [],
    showTitle: true,
    title: 'MACD Analysis',
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
    this.MACD = [];
    this.MACDDIff = [];
    this.MACDSign = [];
    this.buy = [];
    this.zeroLine = [];
    if (!this.loaded && event) {
      this.spinner.show();
      this.questionService.getMACD(this.windowSize, this.fileKey, this.n_fast, this.n_slow).subscribe(
        (res) => {
          this.data = res;
          console.log(res, '=================================')
          console.log(res[0]['SHORTNAME']+'-----------------------------------------')
          this.data.forEach((element) => {
            this.dates.push(new Date(element.Date).getTime());
            const responseMean = 'ADX_' + this.windowSize + '_14';
            this.MACD.push(element['MACD_'+ this.n_fast + '_' + this.n_slow]);
            this.MACDDIff.push(element['MACDdiff_' + this.n_fast + '_' + this.n_slow]);
            this.MACDSign.push(element['MACDsign_' + this.n_fast + '_' + this.n_slow]);
            this.zeroLine.push(0);
            if((element['MACD_'+ this.n_fast + '_' + this.n_slow] > 0) && (element['MACD_'+ this.n_fast + '_' + this.n_slow] > element['MACDsign_' + this.n_fast + '_' + this.n_slow])){
              this.buy.push(element['MACD_'+ this.n_fast + '_' + this.n_slow]);
            }
            else{
              this.buy.push(null);
            }
          });
          const data = {
            // A labels array that can contain any sort of values
            labels: this.dates,
            // Our series array that contains series objects or in this case series data arrays
            series: [
              this.MACD,
              this.MACDSign,
              this.buy,
              this.zeroLine
              
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
