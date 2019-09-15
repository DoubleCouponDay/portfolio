import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { contentswitchercomponent } from './background.component';

describe('BackgroundComponent', () => {
  let component: contentswitchercomponent;
  let fixture: ComponentFixture<contentswitchercomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ contentswitchercomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(contentswitchercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
