import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import * as axisTitle from 'chartist-plugin-axistitle';
import * as chartistLegend from 'chartist-plugin-legend';
import * as moment from 'moment';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-line-chart-h',
  templateUrl: './line-chart-h.component.html',
  styleUrls: ['./line-chart-h.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartHComponent implements OnInit {

  @Input() chartData: any;
  chartistLineChart: any;
  data: any;
  dates: number[] = [];
  closeValues: any[] = [];
  obVolume: any[] = [];
  constructor() { }

  ngOnInit() {
    const legendDiv = document.getElementById('legend-h');
    this.data = this.chartData;
    console.log(this.chartData);
    const options = {
      showPoint: false,
      scaleMinSpace: 20,
      width: '100%',
      height: '100%',
      lineSmooth: false,
      axisX: {
        labelInterpolationFnc: (value, index) => {
          const amount = index;
          if (index % amount === 0) {
            return moment(value).format('DD-MMM-YY');
          } else {
            return '';
          }
        },
        showGrid: true,
      },
      axisY: {
        showGrid: true,
        axisTitle: 'Value (LKR)',
      },
      elements: {point: {radius: 0}},
      series: {
      'series-0': {
      showArea: true
      }
  },
plugins: [
        axisTitle({
          axisX: {
            low: 0,
            axisTitle: 'Timeline',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 35,
            },
            textAnchor: 'middle',
            flipTitle: false,
          },
          axisY: {
            axisTitle: 'Forecast (LKR)',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 10,
            },
            textAnchor: 'middle',
            flipTitle: true,
          },
        }),
        chartistLegend(
          {
	          position: legendDiv,
            className: 'ct-legend-line',
          },
        ),
      ]
    };
    this.chartistLineChart = new Chartist.Line('.ct-chart-h', this.data, options);
    this.chartistLineChart.supportsForeignObject = false;
    /*this.rotateLabel();*/
  }

  ngOnChanges(param: any) {
    this.data = this.chartData;
  }

}
