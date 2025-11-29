import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postlist } from './postlist';

describe('Postlist', () => {
  let component: Postlist;
  let fixture: ComponentFixture<Postlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Postlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
