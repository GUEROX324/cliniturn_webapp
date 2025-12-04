import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-appointment-modal',
  templateUrl: './cancel-appointment-modal.component.html',
  styleUrls: ['./cancel-appointment-modal.component.scss']
})
export class CancelAppointmentModalComponent {

  public idCita: number = 0;

  constructor(
    private dialogRef: MatDialogRef<CancelAppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.idCita = data.id;
  }

  public cerrar_modal(): void {
    this.dialogRef.close({ isCancel: false });
  }

  public cancelarCita(): void {
    const confirmacion = window.confirm('¿Está seguro de que desea cancelar esta cita?');
    if (!confirmacion) {
      this.cerrar_modal();
      return;
    }

    this.dialogRef.close({ isCancel: true });
  }
}
