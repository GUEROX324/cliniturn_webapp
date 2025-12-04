import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SpecialtiesService } from 'src/app/services/specialties.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-specialties-form',
  templateUrl: './specialties-form.component.html',
  styleUrls: ['./specialties-form.component.scss']
})
export class SpecialtiesFormComponent implements OnInit {

  public especialidad: any = {};
  public errores: any = {};
  public editar: boolean = false;
  public idEspecialidad: number = 0;
  public token: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private specialtiesService: SpecialtiesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();

    if (this.token === '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.especialidad = this.specialtiesService.esquemaEspecialidad();

    if (this.activatedRoute.snapshot.params['id'] !== undefined) {
      this.editar = true;
      this.idEspecialidad = this.activatedRoute.snapshot.params['id'];
      this.obtenerEspecialidad();
    }
  }

  public obtenerEspecialidad(): void {
    this.specialtiesService.getEspecialidadByID(this.idEspecialidad).subscribe(
      (response: any) => {
        this.especialidad = {
          id: response.id,
          // usamos id como "clave" solo visual
          clave: response.id,
          nombre: response.nombre,
          descripcion: response.descripcion,
          activa: response.activa
        };
        console.log('Especialidad cargada: ', this.especialidad);
      },
      (error: any) => {
        alert('No se pudo obtener la información de la especialidad');
        console.error(error);
      }
    );
  }

  public guardarEspecialidad(): void {
    this.errores = {};
    this.errores = this.specialtiesService.validarEspecialidad(this.especialidad, this.editar);

    if (Object.keys(this.errores).length > 0) {
      return;
    }

    if (this.editar) {
      this.specialtiesService.editarEspecialidad(this.especialidad).subscribe(
        (response: any) => {
          alert('Especialidad actualizada correctamente');
          this.router.navigate(['/specialties/list']);
        },
        (error: any) => {
          alert('No se pudo actualizar la especialidad');
          console.error(error);
        }
      );
    } else {
      this.specialtiesService.registrarEspecialidad(this.especialidad).subscribe(
        (response: any) => {
          alert('Especialidad registrada correctamente');
          this.router.navigate(['/specialties/list']);
        },
        (error: any) => {
          alert('No se pudo registrar la especialidad');
          console.error(error);
        }
      );
    }
  }

  public regresar(): void {
    this.location.back();
  }
}
