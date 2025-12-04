import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAppointmentModalComponent } from './confirm-appointment-modal.component';

describe('ConfirmAppointmentModalComponent', () => {
  let component: ConfirmAppointmentModalComponent;
  let fixture: ComponentFixture<ConfirmAppointmentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAppointmentModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
