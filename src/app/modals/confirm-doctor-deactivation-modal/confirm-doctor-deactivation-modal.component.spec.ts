import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDoctorDeactivationModalComponent } from './confirm-doctor-deactivation-modal.component';

describe('ConfirmDoctorDeactivationModalComponent', () => {
  let component: ConfirmDoctorDeactivationModalComponent;
  let fixture: ComponentFixture<ConfirmDoctorDeactivationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDoctorDeactivationModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmDoctorDeactivationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
