import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import {QuestionService} from '../app.service';

@Component({
  selector: 'app-bar-chart-a',
  templateUrl: './bar-chart-a.component.html',
  styleUrls: ['./bar-chart-a.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartAComponent implements OnInit {
  @Input() chartData: any;
  constructor( private questionService: QuestionService) { }

  ngOnInit() {
    new Chartist.Bar('.ct-chart-bar-a', {labels: ['GF', 'GNRF', 'GMNF', 'GIAF', 'NF'],
  series: this.chartData }, {
  	distributeSeries: true
	});

  }

}
