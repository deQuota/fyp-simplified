import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastingToolComponent } from './forecasting-tool.component';

describe('ForecastingToolComponent', () => {
  let component: ForecastingToolComponent;
  let fixture: ComponentFixture<ForecastingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
