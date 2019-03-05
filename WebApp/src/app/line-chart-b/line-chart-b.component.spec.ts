import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartBComponent } from './line-chart-b.component';

describe('LineChartBComponent', () => {
  let component: LineChartBComponent;
  let fixture: ComponentFixture<LineChartBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
