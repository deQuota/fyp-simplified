import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartGComponent } from './line-chart-g.component';

describe('LineChartGComponent', () => {
  let component: LineChartGComponent;
  let fixture: ComponentFixture<LineChartGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
