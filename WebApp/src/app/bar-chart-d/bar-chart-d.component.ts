import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-bar-chart-d',
  templateUrl: './bar-chart-d.component.html',
  styleUrls: ['./bar-chart-d.component.css']
})
export class BarChartDComponent implements OnInit {
  @Input() chartData: any;
  constructor( private questionService: QuestionService) { }

  ngOnInit() {
    new Chartist.Bar('.ct-chart-bar-d', {labels: ['GF', 'GNRF', 'GMNF', 'GIAF', 'NF'],
  series: this.chartData }, {
    distributeSeries: true
  });

  }

}