import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAd } from './free-ad';

describe('FreeAd', () => {
  let component: FreeAd;
  let fixture: ComponentFixture<FreeAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
