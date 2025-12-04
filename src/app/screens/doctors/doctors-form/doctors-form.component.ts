import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service';
import { SpecialtiesService } from 'src/app/services/specialties.service';

@Component({
  selector: 'app-doctors-form',
  templateUrl: './doctors-form.component.html',
  styleUrls: ['./doctors-form.component.scss']
})
export class DoctorsFormComponent implements OnInit {

  public doctor: any = {};
  public errores: any = {};
  public editar: boolean = false;
  public idDoctor: number = 0;
  public token: string = '';
  public especialidades: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private doctorService: DoctorService,
    private router: Router,
    private authService: AuthService,
    private specialtiesService: SpecialtiesService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();

    if (!this.token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Esquema base
    this.doctor = this.doctorService.esquemaDoctor();

    // Cargar catálogo de especialidades
    this.obtenerEspecialidades();

    // ¿Edición?
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idDoctor = this.activatedRoute.snapshot.params['id'];
      this.obtenerDoctor();
    }
  }

  public obtenerEspecialidades(): void {
    this.specialtiesService.obtenerListaEspecialidades().subscribe(
      (response: any) => {
        this.especialidades = response;
        console.log('Especialidades disponibles:', this.especialidades);
      },
      (error: any) => {
        console.error('Error al obtener especialidades', error);
      }
    );
  }

  public obtenerDoctor(): void {
    this.doctorService.getDoctorByID(this.idDoctor).subscribe(
      (response: any) => {
        console.log('Respuesta getDoctorByID:', response);

        let especialidadId: number | null = null;

        // Caso 1: viene como objeto { id, nombre, ... }
        if (response.especialidad && typeof response.especialidad === 'object') {
          especialidadId = response.especialidad.id;
        }
        // Caso 2: viene directo como número o string ("1")
        else if (response.especialidad) {
          especialidadId = Number(response.especialidad);
        }

        this.doctor = {
          id: response.id,
          cedula: response.cedula,
          telefono: response.telefono,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          especialidad: especialidadId,   // 👈 aquí ya va el id correcto o null
          activo: response.activo
        };

        console.log('Doctor mapeado en el form:', this.doctor);
      },
      (error: any) => {
        alert('No se pudo obtener la información del médico');
        console.error(error);
      }
    );
  }


  public guardarDoctor(): void {
    // Validar
    this.errores = this.doctorService.validarDoctor(this.doctor, this.editar);
    if (this.errores && Object.keys(this.errores).length > 0) {
      return;
    }

    // Clonamos para armar el payload limpio
    const payload: any = { ...this.doctor };

    // Normalizar especialidad → solo id o null
    if (payload.especialidad === '' || payload.especialidad === undefined) {
      payload.especialidad = null;
    } else if (typeof payload.especialidad === 'object' && payload.especialidad !== null) {
      payload.especialidad = payload.especialidad.id;
    } else if (typeof payload.especialidad === 'string') {
      payload.especialidad = Number(payload.especialidad);
    }

    // Al crear, aseguramos rol = medico (si tu backend lo usa)
    if (!this.editar) {
      payload.rol = 'medico';
    }

    console.log('Payload que se envía al backend:', payload);

    if (this.editar) {
      this.doctorService.editarDoctor(payload).subscribe(
        () => {
          alert('Médico actualizado correctamente');
          this.router.navigate(['/doctors/list']);
        },
        (error) => {
          alert('No se pudo actualizar el médico');
          console.error(error);
        }
      );
    } else {
      this.doctorService.registrarDoctor(payload).subscribe(
        () => {
          alert('Médico registrado correctamente');
          this.router.navigate(['/doctors/list']);
        },
        (error) => {
          alert('No se pudo registrar el médico');
          console.error(error);
        }
      );
    }
  }

  public regresar(): void {
    this.location.back();
  }

}
