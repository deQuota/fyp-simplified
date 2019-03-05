import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-bar-chart-b',
  templateUrl: './bar-chart-b.component.html',
  styleUrls: ['./bar-chart-b.component.css']
})
export class BarChartBComponent implements OnInit {
  @Input() chartData: any;
  constructor( private questionService: QuestionService) { }

  ngOnInit() {
    new Chartist.Bar('.ct-chart-bar-b', {labels: ['GF', 'GNRF', 'GMNF', 'GIAF', 'NF'],
  series: this.chartData }, {
    distributeSeries: true
  });

  }

}