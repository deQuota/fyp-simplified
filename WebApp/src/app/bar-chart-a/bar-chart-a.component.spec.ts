import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartAComponent } from './bar-chart-a.component';

describe('BarChartAComponent', () => {
  let component: BarChartAComponent;
  let fixture: ComponentFixture<BarChartAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
