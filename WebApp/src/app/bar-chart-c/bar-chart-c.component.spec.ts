import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartCComponent } from './bar-chart-c.component';

describe('BarChartCComponent', () => {
  let component: BarChartCComponent;
  let fixture: ComponentFixture<BarChartCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
