import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarepageComponent } from './hardwarepage.component';

describe('HardwarepageComponent', () => {
  let component: HardwarepageComponent;
  let fixture: ComponentFixture<HardwarepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwarepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwarepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
