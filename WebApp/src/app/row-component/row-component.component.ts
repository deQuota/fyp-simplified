import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-row-component',
  templateUrl: './row-component.component.html',
  styleUrls: ['./row-component.component.css']
})
export class RowComponentComponent implements OnInit {
  encapsulation: ViewEncapsulation.None // <------
  constructor() { }

  ngOnInit() {
  }

}
