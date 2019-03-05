import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartFComponent } from './line-chart-f.component';

describe('LineChartFComponent', () => {
  let component: LineChartFComponent;
  let fixture: ComponentFixture<LineChartFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
