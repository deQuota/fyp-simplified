import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import * as axisTitle from 'chartist-plugin-axistitle';
import * as chartistLegend from 'chartist-plugin-legend';
import * as moment from 'moment';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-line-chart-b',
  templateUrl: './line-chart-b.component.html',
  styleUrls: ['./line-chart-b.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartBComponent implements OnInit {

  @Input() chartData: any;
  chartistLineChart: any;
  data: any;
  dates: number[] = [];
  closeValues: any[] = [];
  obVolume: any[] = [];

  constructor() { }

  ngOnInit() {
    const legendDiv = document.getElementById('legend-b');
    this.data = this.chartData;
    console.log(this.chartData);
    const options = {
      showPoint: false,
      scaleMinSpace: 20,
      width: '100%',
      height: '100%',
      lineSmooth: false,
      axisX: {
        showGrid: false,
        labelInterpolationFnc: (value, index) => {
          const amount = index*0.01;
          if (index % amount === 0) {
            return moment(value).format('MMM-YY');
          } else {
            return '';
          }
        }
      },
      axisY: {
        showGrid: true,
        axisTitle: 'Value (LKR)',
      },
      elements: {point: {radius: 0}},
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
            axisTitle: 'On-Balance Volume',
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
            legendNames: ['On-Balance Volume'],
            className: 'ct-legend-line',
          },
        ),
      ]
    };
    this.chartistLineChart = new Chartist.Line('.ct-chart-b', this.data, options);
    this.chartistLineChart.supportsForeignObject = false;
  }

  ngOnChanges(param: any) {
    this.data = this.chartData;
  }

}
