import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { vectorscomponent } from './vectors.component';

describe('vectorscomponent', () => {
  let component: vectorscomponent;
  let fixture: ComponentFixture<vectorscomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ vectorscomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(vectorscomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
