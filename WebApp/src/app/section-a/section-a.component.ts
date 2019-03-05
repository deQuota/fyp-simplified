import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';

@Component({
  selector: 'app-section-a',
  templateUrl: './section-a.component.html',
  styleUrls: ['./section-a.component.css'],
  encapsulation: ViewEncapsulation.None // <------
})
export class SectionAComponent implements OnInit {

   @Input() fileKey: '';
 windowSize = 1;
  enable = false;
  loaded = false;
  chartistLineChart: any;
  data: any;
  processedChartData: any;
  dates: number[] = [];
  closeValues: any[] = [];
  meanAverage: any[] = [];

  options: any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [],
    showTitle: true,
    title: 'Moving Average Analysis',
    useBom: true,
    removeNewLines: false,
    keys: []
  };
  constructor(
    private questionService: QuestionService,
    private spinnerService: Ng4LoadingSpinnerService,
    private spinner: NgxSpinnerService) {

  }


  ngOnInit() {
    console.log(this.fileKey+ ' from section a');

  }

  onChange(event) {
    console.log(event);
    this.enable = event;
    this.loaded = false;
    this.dates = [];
    this.closeValues = [];
    this.meanAverage = [];
    if (!this.loaded && event) {
      this.spinner.show();
      this.questionService.getMeanAverage(this.windowSize, this.fileKey).subscribe(
        (res) => {
          this.data = res;
          /*console.log(res[0]['SHORTNAME']+'-----------------------------------------')*/
          this.data.forEach((element) => {
            this.dates.push(new Date(element.Date).getTime());
            this.closeValues.push(element.Close);
            const responseMean = 'MA_' + this.windowSize;
            this.meanAverage.push(element['MA_'+ this.windowSize]);
          });
          const data = {
            // A labels array that can contain any sort of values
            labels: this.dates,
            // Our series array that contains series objects or in this case series data arrays
            series: [
              this.closeValues,
              this.meanAverage
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
