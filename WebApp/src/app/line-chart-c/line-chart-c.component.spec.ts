import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartCComponent } from './line-chart-c.component';

describe('LineChartCComponent', () => {
  let component: LineChartCComponent;
  let fixture: ComponentFixture<LineChartCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
