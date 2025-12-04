import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-confirm-doctor-deactivation-modal',
  templateUrl: './confirm-doctor-deactivation-modal.component.html',
  styleUrls: ['./confirm-doctor-deactivation-modal.component.scss']
})
export class ConfirmDoctorDeactivationModalComponent implements OnInit {

  public idDoctor: number = 0;
  public activo: boolean = true;

  constructor(
    private doctorService: DoctorService,
    private dialogRef: MatDialogRef<ConfirmDoctorDeactivationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.idDoctor = this.data.id;
    this.activo = this.data.activo;
  }

  public cerrar_modal() {
    this.dialogRef.close({ isChange: false });
  }

  public cambiarEstado() {
    const accion = this.activo ? 'desactivar' : 'activar';
    const confirmacion = window.confirm(`¿Está seguro de que desea ${accion} este médico?`);
    if (!confirmacion) {
      this.cerrar_modal();
      return;
    }

    this.doctorService.cambiarEstadoDoctor(this.idDoctor).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close({ isChange: true });
      },
      (error) => {
        console.error(error);
        this.dialogRef.close({ isChange: false });
      }
    );
  }

    public confirmarDesactivacion() {
    this.doctorService.cambiarEstadoDoctor(this.idDoctor).subscribe(
      (response: any) => {
        console.log(response);
        this.dialogRef.close({ isDeactivated: true });
      },
      (error: any) => {
        console.error(error);
        this.dialogRef.close({ isDeactivated: false });
      }
    );
  }

}
