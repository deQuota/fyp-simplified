import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartBComponent } from './bar-chart-b.component';

describe('BarChartBComponent', () => {
  let component: BarChartBComponent;
  let fixture: ComponentFixture<BarChartBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
