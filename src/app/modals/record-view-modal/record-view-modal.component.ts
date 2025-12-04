import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordsService } from 'src/app/services/records.service';

@Component({
  selector: 'app-record-view-modal',
  templateUrl: './record-view-modal.component.html',
  styleUrls: ['./record-view-modal.component.scss']
})
export class RecordViewModalComponent implements OnInit {

  loading = false;
  detalle: DetalleExpediente | null = null;

  constructor(
    private recordsService: RecordsService,
    private dialogRef: MatDialogRef<RecordViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, resumen: any }
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  private cargarDetalle(): void {
    this.loading = true;
    this.recordsService.obtenerDetalleExpediente(this.data.id).subscribe(
      (resp: DetalleExpediente) => {
        this.detalle = resp;
        this.loading = false;
        console.log('Detalle expediente: ', this.detalle);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo cargar el expediente completo');
        console.error(error);
      }
    );
  }

  public cerrar(): void {
    this.dialogRef.close();
  }
}

export interface CitaExpediente {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  medico: string;
  especialidad: string;
}

export interface DetalleExpediente {
  id: number;
  paciente: string;
  matricula: string | null;
  medico: string;
  especialidad: string;
  ultima_cita: string | null;
  total_citas: number;
  citas: CitaExpediente[];
}
