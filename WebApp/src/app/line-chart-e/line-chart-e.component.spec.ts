import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartEComponent } from './line-chart-e.component';

describe('LineChartEComponent', () => {
  let component: LineChartEComponent;
  let fixture: ComponentFixture<LineChartEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
