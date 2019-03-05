import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-bar-chart-c',
  templateUrl: './bar-chart-c.component.html',
  styleUrls: ['./bar-chart-c.component.css']
})
export class BarChartCComponent implements OnInit {
  @Input() chartData: any;
  constructor( private questionService: QuestionService) { }

  ngOnInit() {
    new Chartist.Bar('.ct-chart-bar-c', {labels: ['GF', 'GNRF', 'GMNF', 'GIAF', 'NF'],
  series: this.chartData }, {
    distributeSeries: true
  });

  }

}