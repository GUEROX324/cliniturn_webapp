import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { AuthService } from 'src/app/services/auth.service';
import { SpecialtiesService } from 'src/app/services/specialties.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { UsersService } from 'src/app/services/users.service';
import { ConsultoriosService } from 'src/app/services/consultorios.service';

declare var $: any;

@Component({
  selector: 'app-appointments-form',
  templateUrl: './appointments-form.component.html',
  styleUrls: ['./appointments-form.component.scss']
})
export class AppointmentsFormComponent implements OnInit {

  public cita: DatosCita;
  public errores: any = {};
  public editar: boolean = false;
  public idCita: number = 0;
  public token: string = '';

  public listaPacientes: any[] = [];
  public listaDoctores: any[] = [];
  public listaEspecialidades: any[] = [];
  public doctoresFiltrados: any[] = [];
  public listaConsultorios: any[] = [];

  // 🔹 NUEVO: horarios
  public todosHorarios: string[] = [];
  public horariosDisponibles: string[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private appointmentsService: AppointmentsService,
    private specialtiesService: SpecialtiesService,
    private doctorService: DoctorService,
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService,
    private consultoriosService: ConsultoriosService
  ) {
    // inicializamos usando el esquema del service
    this.cita = this.appointmentsService.esquemaCita();

    // 🔹 Generar horarios 08:00–17:00 cada 30 min
    this.todosHorarios = this.generarHorarios();
    this.horariosDisponibles = [...this.todosHorarios];
  }

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();

    if (this.token == '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cargarCombos();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idCita = Number(this.activatedRoute.snapshot.params['id']);
      this.obtenerCita();
    }
  }

  // 🔹 Generar horarios de 08:00 a 17:00 cada 30 minutos
  private generarHorarios(): string[] {
    const slots: string[] = [];
    for (let h = 8; h <= 17; h++) {
      for (let m of [0, 30]) {
        // Para las 17:00 solo 17:00, no 17:30
        if (h === 17 && m === 30) continue;

        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    console.log('Todos los horarios:', slots);
    return slots;
  }

  public cargarCombos(): void {
    this.usersService.obtenerListaPacientes().subscribe(
      (response) => { this.listaPacientes = response; },
      (error) => { console.error(error); }
    );

    this.doctorService.obtenerListaDoctores().subscribe(
      (response) => {
        this.listaDoctores = response;
        console.log('Doctores: ', this.listaDoctores);
      },
      (error) => { console.error(error); }
    );

    this.specialtiesService.obtenerListaEspecialidades().subscribe(
      (response) => {
        this.listaEspecialidades = response;
        console.log('Especialidades: ', this.listaEspecialidades);
      },
      (error) => { console.error(error); }
    );

    this.consultoriosService.obtenerListaConsultorios().subscribe(
      (response) => {
        this.listaConsultorios = response.filter((c: any) => c.disponible === true);
        console.log('Consultorios disponibles (filtrados en front): ', this.listaConsultorios);
      },
      (error) => {
        console.error('Error al obtener consultorios', error);
      }
    );
  }

  public obtenerCita(): void {
    this.appointmentsService.getCitaByID(this.idCita).subscribe(
      (response) => {
        this.cita = {
          id: response.id ?? null,
          paciente: response.paciente ?? null,
          medico: response.medico ?? null,
          fecha: response.fecha ?? '',
          hora: response.hora ?? '',
          motivo: response.motivo ?? '',
          estado: response.estado ?? 'Pendiente',
          consultorio: response.consultorio ?? null,
          especialidad: response.especialidad ?? null
        };
        console.log('Cita cargada: ', this.cita);
        this.filtrarDoctoresPorEspecialidad();
        this.actualizarHorariosDisponibles();
      },
      (error) => {
        alert('No se pudo obtener la información de la cita');
        console.error(error);
      }
    );
  }

  public filtrarDoctoresPorEspecialidad(): void {
    const espId = this.cita.especialidad;

    if (!espId) {
      this.doctoresFiltrados = [...this.listaDoctores];
    } else {
      this.doctoresFiltrados = this.listaDoctores.filter(
        (d: any) => d.especialidad == espId || d.especialidad_id == espId
      );
    }

    if (this.cita.medico && !this.doctoresFiltrados.some((d: any) => d.id == this.cita.medico)) {
      this.cita.medico = null;
    }
  }

  // 🔹 Llamado cuando cambia fecha o médico
  public onFechaOMedicoChange(): void {
    this.actualizarHorariosDisponibles();
  }

  // 🔹 Consulta citas del médico+fecha y bloquea horas ocupadas
  private actualizarHorariosDisponibles(): void {
    // Si no hay fecha o médico aún, mostrar todos los horarios
    if (!this.cita.fecha || !this.cita.medico) {
      this.horariosDisponibles = [...this.todosHorarios];
      console.log('Sin fecha o médico → todos los horarios');
      return;
    }

    this.appointmentsService
      .getCitasPorMedicoYFecha(this.cita.medico, this.cita.fecha)
      .subscribe(
        (citasDelDia: any[]) => {
          console.log('Citas del médico en esa fecha:', citasDelDia);

          const ocupadas = new Set<string>();

          citasDelDia.forEach((cita: any) => {
            // Si estás editando, ignora tu propia cita
            if (this.editar && this.cita.id && cita.id === this.cita.id) {
              return;
            }

            // No bloquear canceladas
            const estado = (cita.estado || '').toLowerCase();
            if (estado === 'cancelada') return;

            if (cita.hora) {
              ocupadas.add(cita.hora.substring(0, 5)); // HH:MM
            }
          });

          this.horariosDisponibles = this.todosHorarios.filter(hora => {
            if (this.editar && this.cita.hora === hora) {
              return true; // permitir su propia hora
            }
            return !ocupadas.has(hora);
          });

          console.log('Horarios disponibles:', this.horariosDisponibles);
        },
        (error) => {
          console.error('Error al obtener citas del doctor para esa fecha', error);
          this.horariosDisponibles = [...this.todosHorarios];
        }
      );
  }

  public guardarCita(): void {
    this.errores = {};

    this.errores = this.appointmentsService.validarCita(this.cita, this.editar);

    if (!$.isEmptyObject(this.errores)) {
      return;
    }

    let peticion$;

    if (this.editar) {
      this.cita.id = this.idCita;
      peticion$ = this.appointmentsService.editarCita(this.cita);
    } else {
      peticion$ = this.appointmentsService.registrarCita(this.cita);
    }

    peticion$.subscribe(
      (response: any) => {
        alert(this.editar ? 'Cita actualizada correctamente' : 'Cita registrada correctamente');
        this.router.navigate(['/appointments/list']);
      },
      (error: any) => {
        console.error('Error al guardar la cita:', error);
        const msg = error.error.details || error.error.detail || 'Error desconocido';
        alert('Error del servidor: ' + msg);
      }
    );
  }

  public regresar(): void {
    this.location.back();
  }
}

export interface DatosCita {
  id: number | null;
  paciente: number | null;
  medico: number | null;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  consultorio: number | null;
  especialidad: number | null;
}
