import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecordsService } from 'src/app/services/records.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RecordViewModalComponent } from 'src/app/modals/record-view-modal/record-view-modal.component';
import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit {

  public expedientes: ExpedienteResumen[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';

  public puedeVerExpedientes = false;
  public descargandoId: number | null = null;

  constructor(
    private router: Router,
    private recordsService: RecordsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup() || '';

    if (this.token === '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    const rolLower = this.rol.toLowerCase();
    console.log('ROL ACTUAL:', this.rol, '->', rolLower);

    const rolesPermitidos = [
      'admin',
      'administrador',
      'administradora',
      'medico',
      'médico',
      'doctor',
      'doctora'
    ];

    this.puedeVerExpedientes = rolesPermitidos.includes(rolLower);

    if (!this.puedeVerExpedientes) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.obtenerExpedientes();
  }

  public obtenerExpedientes(): void {
    this.loading = true;
    this.recordsService.obtenerListaExpedientes().subscribe(
      (response: ExpedienteResumen[]) => {
        this.expedientes = response || [];
        this.loading = false;
        console.log('Lista de expedientes: ', this.expedientes);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de expedientes');
        console.error(error);
      }
    );
  }

  public verExpediente(exp: ExpedienteResumen): void {
    if (!this.puedeVerExpedientes) return;

    this.dialog.open(RecordViewModalComponent, {
      data: {
        id: exp.id,
        resumen: exp
      },
      width: '720px',
      height: 'auto'
    });
  }

  public descargarExpediente(exp: ExpedienteResumen): void {
    if (!this.puedeVerExpedientes) return;

    this.descargandoId = exp.id;

    this.recordsService.descargarExpediente(exp.id).subscribe(
      (detalle: DetalleExpedienteParaPDF) => {
        this.descargandoId = null;
        this.generarPdfExpediente(detalle);
      },
      (error) => {
        this.descargandoId = null;
        alert('No se pudo descargar el expediente');
        console.error(error);
      }
    );
  }

  private generarPdfExpediente(detalle: DetalleExpedienteParaPDF): void {
    const doc = new jspdf.jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    const fecha = new Date();

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Expediente clínico', 40, 40);

    // Fecha
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generado: ${fecha.toLocaleString()}`, 40, 60);

    // Datos generales del paciente
    const y0 = 80;
    let y = y0;

    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detalle.paciente || '—', 120, y);

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Matrícula:', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detalle.matricula || '—', 120, y);

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Médico principal:', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detalle.medico || '—', 150, y);

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Especialidad:', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detalle.especialidad || '—', 130, y);

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Total de citas:', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(detalle.total_citas || 0), 150, y);

    y += 24;

    const head: string[][] = [[
      'Fecha',
      'Hora',
      'Médico',
      'Especialidad',
      'Motivo',
      'Estado'
    ]];

    const body: (string | number | null)[][] = (detalle.citas || []).map((c: CitaPDF) => [
      c.fecha || '',
      c.hora || '',
      c.medico || '—',
      c.especialidad || '—',
      c.motivo || '—',
      c.estado || '—'
    ]);

    autoTable(doc as any, {
      head,
      body,
      startY: y,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [0, 146, 184] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 90 },
        3: { cellWidth: 90 },
        4: { cellWidth: 150 },
        5: { cellWidth: 60 }
      },
      didDrawPage: (data: any) => {
        const pageSize = (doc as any).internal.pageSize;
        const pageHeight = pageSize.height ?? pageSize.getHeight?.() ?? 842;
        const pageWidth = pageSize.width ?? pageSize.getWidth?.() ?? 595;
        const page = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Página ${page}`, pageWidth - 60, pageHeight - 20);
      }
    });

    const baseName = detalle.matricula || detalle.paciente || detalle.id;
    doc.save(`expediente-${baseName}.pdf`);
  }

}

export interface ExpedienteResumen {
  id: number;
  paciente: string;
  matricula: string | null;
  medico: string;
  especialidad: string;
  ultima_cita: string | null;
  total_citas: number;
}

export interface CitaPDF {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  medico: string;
  especialidad: string;
}

export interface DetalleExpedienteParaPDF {
  id: number;
  paciente: string;
  matricula: string | null;
  medico: string;
  especialidad: string;
  ultima_cita: string | null;
  total_citas: number;
  citas: CitaPDF[];
  detalle?: string;
}
