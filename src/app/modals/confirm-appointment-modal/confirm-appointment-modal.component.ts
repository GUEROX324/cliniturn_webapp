import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-appointment-modal',
  templateUrl: './confirm-appointment-modal.component.html',
  styleUrls: ['./confirm-appointment-modal.component.scss']
})
export class ConfirmAppointmentModalComponent {

  public idCita: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ConfirmAppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.idCita = data.id;
  }

  public cerrar_modal(): void {
    this.dialogRef.close({ isConfirm: false });
  }

  public confirmarCita(): void {
    const confirmacion = window.confirm('¿Está seguro de que desea confirmar esta cita?');
    if (!confirmacion) {
      this.cerrar_modal();
      return;
    }

    this.dialogRef.close({ isConfirm: true });
  }
}
