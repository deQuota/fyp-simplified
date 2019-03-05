import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartHComponent } from './line-chart-h.component';

describe('LineChartHComponent', () => {
  let component: LineChartHComponent;
  let fixture: ComponentFixture<LineChartHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
