import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartDComponent } from './bar-chart-d.component';

describe('BarChartDComponent', () => {
  let component: BarChartDComponent;
  let fixture: ComponentFixture<BarChartDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
