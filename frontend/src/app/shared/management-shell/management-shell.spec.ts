import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementShell } from './management-shell';

describe('ManagementShell', () => {
  let component: ManagementShell;
  let fixture: ComponentFixture<ManagementShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
