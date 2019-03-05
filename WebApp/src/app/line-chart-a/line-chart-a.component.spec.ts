import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartAComponent } from './line-chart-a.component';

describe('LineChartAComponent', () => {
  let component: LineChartAComponent;
  let fixture: ComponentFixture<LineChartAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
