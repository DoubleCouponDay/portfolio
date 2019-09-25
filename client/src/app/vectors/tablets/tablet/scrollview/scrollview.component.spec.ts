import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollviewComponent } from './scrollview.component';

describe('ScrollviewComponent', () => {
  let component: ScrollviewComponent;
  let fixture: ComponentFixture<ScrollviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
