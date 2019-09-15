import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicpageComponent } from './musicpage.component';

describe('MusicpageComponent', () => {
  let component: MusicpageComponent;
  let fixture: ComponentFixture<MusicpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
