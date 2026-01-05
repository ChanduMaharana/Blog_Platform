import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAd } from './google-ad';

describe('GoogleAd', () => {
  let component: GoogleAd;
  let fixture: ComponentFixture<GoogleAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
