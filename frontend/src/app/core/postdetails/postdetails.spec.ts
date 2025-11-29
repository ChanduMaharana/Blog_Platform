import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postdetails } from './postdetails';

describe('Postdetails', () => {
  let component: Postdetails;
  let fixture: ComponentFixture<Postdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Postdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
