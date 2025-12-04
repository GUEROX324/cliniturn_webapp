import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmAppointmentModalComponent } from 'src/app/modals/confirm-appointment-modal/confirm-appointment-modal.component';
import { CancelAppointmentModalComponent } from 'src/app/modals/cancel-appointment-modal/cancel-appointment-modal.component';

import { UsersService } from 'src/app/services/users.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { SpecialtiesService } from 'src/app/services/specialties.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent implements OnInit {

  public citas: any[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';

  public listaPacientes: any[] = [];
  public listaDoctores: any[] = [];
  public listaEspecialidades: any[] = [];

  // 🔐 Flags de rol
  public esAdmin = false;
  public esMedico = false;
  public esPaciente = false;

  constructor(
    private router: Router,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    public dialog: MatDialog,
    private usersService: UsersService,
    private doctorService: DoctorService,
    private specialtiesService: SpecialtiesService
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup();

    if (this.token == '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    const rolLower = (this.rol || '').toLowerCase();
    console.log('ROL ACTUAL:', this.rol, '->', rolLower);

    // Admin
    this.esAdmin = ['admin', 'administrador', 'administradora'].includes(rolLower);

    // Médico
    this.esMedico = ['medico', 'médico', 'doctor', 'doctora'].includes(rolLower);

    // Paciente (ajusta si el grupo se llama distinto)
    this.esPaciente = ['paciente', 'alumno', 'estudiante'].includes(rolLower);

    this.cargarCatalogos();
    this.obtenerCitas();
  }

  // ==============================
  // Catálogos
  // ==============================
  public cargarCatalogos(): void {
    this.usersService.obtenerListaPacientes().subscribe(
      res => this.listaPacientes = res,
      err => console.error('Error cargando pacientes', err)
    );

    this.doctorService.obtenerListaDoctores().subscribe(
      res => {
        this.listaDoctores = res;
        console.log('Doctores: ', this.listaDoctores);
      },
      err => console.error('Error cargando doctores', err)
    );

    this.specialtiesService.obtenerListaEspecialidades().subscribe(
      res => {
        this.listaEspecialidades = res;
        console.log('Especialidades: ', this.listaEspecialidades);
      },
      err => console.error('Error cargando especialidades', err)
    );
  }

  // ==============================
  // Citas
  // ==============================
  public obtenerCitas(): void {
    this.loading = true;

    this.appointmentsService.obtenerListaCitas().subscribe(
      (response: any[]) => {
        this.citas = response;
        this.loading = false;
        console.log('Lista de citas: ', this.citas);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de citas');
        console.error(error);
      }
    );
  }

  // ==============================
  // Helpers nombres
  // ==============================
  public getNombrePaciente(id: number): string {
    if (!this.listaPacientes.length) return 'Cargando...';

    const paciente = this.listaPacientes.find((p: any) => p.id === id);
    if (!paciente) return 'Desconocido';

    return (
      paciente.nombre ||
      (paciente.user
        ? `${paciente.user.first_name} ${paciente.user.last_name}`
        : 'Sin Nombre')
    );
  }

  public getNombreMedico(id: number): string {
    if (!this.listaDoctores.length) return 'Cargando...';

    const doctor = this.listaDoctores.find((d: any) => d.id === id);
    if (!doctor) return 'Desconocido';

    return doctor.user
      ? `${doctor.user.first_name} ${doctor.user.last_name}`
      : 'Sin Nombre';
  }

  public getNombreEspecialidadPorMedico(idMedico: number): string {
    if (!this.listaDoctores.length || !this.listaEspecialidades.length) {
      return '...';
    }

    const doctor = this.listaDoctores.find((d: any) => d.id === idMedico);
    if (!doctor) {
      return 'Sin Especialidad';
    }

    const espId = doctor.especialidad ?? doctor.especialidad_id ?? doctor.especialidadId;
    if (!espId) {
      return 'Sin Especialidad';
    }

    const especialidad = this.listaEspecialidades.find(
      (e: any) => Number(e.id) === Number(espId)
    );

    return especialidad ? especialidad.nombre : 'Sin Especialidad';
  }

  // ==============================
  // Helpers de permisos
  // ==============================
  public puedeVerColumnaPaciente(): boolean {
    return !this.esPaciente;
  }

  public puedeEditar(c: any): boolean {
    return this.esAdmin || this.esMedico;
  }

  public puedeConfirmar(c: any): boolean {
    const est = this.estadoCita(c);
    if (est === 'cancelada' || est === 'completada') return false;
    return this.esAdmin || this.esMedico;
  }

  public puedeCancelar(c: any): boolean {
    const est = this.estadoCita(c);
    if (est === 'cancelada' || est === 'completada') return false;
    return this.esAdmin || this.esMedico || this.esPaciente;
  }

  // ==============================
  // Botones
  // ==============================
  public editarCita(idCita: number): void {
    if (!this.puedeEditar(null)) return;
    this.router.navigate(['/appointments/form', idCita]);
  }

  public nuevaCita(): void {
    if (this.esAdmin || this.esMedico || this.esPaciente) {
      this.router.navigate(['/appointments/form']);
    }
  }

  public abrirModalConfirmar(idCita: number): void {
    const cita = this.citas.find(c => c.id === idCita);
    if (!this.puedeConfirmar(cita)) return;

    const dialogRef = this.dialog.open(ConfirmAppointmentModalComponent, {
      data: { id: idCita },
      height: '260px',
      width: '380px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isConfirm) {
        this.appointmentsService.confirmarCita(idCita).subscribe(
          (resp) => {
            alert('Cita confirmada correctamente');
            this.obtenerCitas();
          },
          (error) => {
            console.error('Error al confirmar cita: ', error);
            console.log('Detalle backend:', error.error);
            alert('No se pudo confirmar la cita: ' + (error.error?.detail || ''));
          }
        );
      }
    });
  }

  public abrirModalCancelar(idCita: number): void {
    const cita = this.citas.find(c => c.id === idCita);
    if (!this.puedeCancelar(cita)) return;

    const dialogRef = this.dialog.open(CancelAppointmentModalComponent, {
      data: { id: idCita },
      height: '260px',
      width: '380px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isCancel) {
        this.appointmentsService.cancelarCita(idCita).subscribe(
          (resp) => {
            alert('Cita cancelada correctamente');
            this.obtenerCitas();
          },
          (error) => {
            console.error('Error al cancelar cita: ', error);
            console.log('Detalle backend:', error.error);
            alert('No se pudo cancelar la cita: ' + (error.error?.detail || ''));
          }
        );
      }
    });
  }

  public estadoCita(c: any): 'pendiente' | 'programada' | 'confirmada' | 'completada' | 'cancelada' {
    const e = (c?.estado || '').toLowerCase().trim();

    if (e === 'confirmada') return 'confirmada';
    if (e === 'completada') return 'completada';
    if (e === 'cancelada') return 'cancelada';
    if (e === 'programada') return 'programada';

    return 'pendiente';
  }

}
