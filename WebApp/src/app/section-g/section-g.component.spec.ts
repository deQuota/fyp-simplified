import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGComponent } from './section-g.component';

describe('SectionGComponent', () => {
  let component: SectionGComponent;
  let fixture: ComponentFixture<SectionGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
