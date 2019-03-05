import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';

@Component({
  selector: 'app-section-d',
  templateUrl: './section-d.component.html',
  styleUrls: ['./section-d.component.css']
})
export class SectionDComponent implements OnInit {

  @Input() fileKey: '';
  windowSize = 1;
  enable = false;
  loaded = false;
  chartistLineChart: any;
  data: any;
  processedChartData: any;
  dates: number[] = [];
  avgDI: any[] = [];
  posDI: any[] = [];
  negDI: any[] = [];
  twntyFive: any[] = [];
  upTrends: any[] = [];
  downTrends: any[] = [];

  options: any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [],
    showTitle: true,
    title: 'Average Directional Index Analysis',
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
    this.posDI = [];
    this.negDI = [];
    this.avgDI = [];
    this.twntyFive = [];
    this.upTrends = [];
    this.downTrends = [];
    if (!this.loaded && event) {
      this.spinner.show();
      this.questionService.getADIndex(this.windowSize, this.fileKey, 14).subscribe(
        (res) => {
          this.data = res;
          console.log(res, '=================================')
          console.log(res[0]['SHORTNAME']+'-----------------------------------------')
          this.data.forEach((element) => {
            this.dates.push(new Date(element.Date).getTime());
            const responseMean = 'ADX_' + this.windowSize + '_14';
            this.avgDI.push(element['ADX_'+ this.windowSize + '_14']);
            this.posDI.push(element['PosDI']);
            this.negDI.push(element['NegDI']);
            this.twntyFive.push(0.25);
            if ((element['ADX_'+ this.windowSize + '_14'] > 0.25) && (element['PosDI']>element['NegDI'])) {
              this.upTrends.push(element['ADX_'+ this.windowSize + '_14']);
            }
            else{
              this.upTrends.push(null);
            }
             if ((element['ADX_'+ this.windowSize + '_14'] > 0.25) && (element['PosDI']<element['NegDI'])) {
              this.downTrends.push(element['ADX_'+ this.windowSize + '_14']);
            }
            else{
              this.downTrends.push(null);
            }
          });
          const data = {
            // A labels array that can contain any sort of values
            labels: this.dates,
            // Our series array that contains series objects or in this case series data arrays
            series: [
              this.avgDI,
              this.posDI,
              this.negDI,
              this.twntyFive,
              this.upTrends,
              this.downTrends

              
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
