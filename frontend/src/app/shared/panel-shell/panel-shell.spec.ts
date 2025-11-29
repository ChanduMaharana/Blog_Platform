import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelShell } from './panel-shell';

describe('PanelShell', () => {
  let component: PanelShell;
  let fixture: ComponentFixture<PanelShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
