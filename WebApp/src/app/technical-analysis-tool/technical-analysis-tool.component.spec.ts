import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAnalysisToolComponent } from './technical-analysis-tool.component';

describe('TechnicalAnalysisToolComponent', () => {
  let component: TechnicalAnalysisToolComponent;
  let fixture: ComponentFixture<TechnicalAnalysisToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalAnalysisToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalAnalysisToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
