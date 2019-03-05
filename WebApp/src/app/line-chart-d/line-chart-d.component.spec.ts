import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartDComponent } from './line-chart-d.component';

describe('LineChartDComponent', () => {
  let component: LineChartDComponent;
  let fixture: ComponentFixture<LineChartDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
