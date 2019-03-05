import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowComponentComponent } from './row-component.component';

describe('RowComponentComponent', () => {
  let component: RowComponentComponent;
  let fixture: ComponentFixture<RowComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
