import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialtiesService } from 'src/app/services/specialties.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-specialties-list',
  templateUrl: './specialties-list.component.html',
  styleUrls: ['./specialties-list.component.scss']
})
export class SpecialtiesListComponent implements OnInit {

  public especialidades: any[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';

  constructor(
    private router: Router,
    private specialtiesService: SpecialtiesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup();

    if (this.token === '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.obtenerEspecialidades();
  }

  public obtenerEspecialidades(): void {
    this.loading = true;
    this.specialtiesService.obtenerListaEspecialidades().subscribe(
      (response) => {
        this.especialidades = response;
        this.loading = false;
        console.log('Lista de especialidades: ', this.especialidades);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de especialidades');
        console.error(error);
      }
    );
  }

  public nuevaEspecialidad(): void {
    this.router.navigate(['/specialties/form']);
  }

  public editarEspecialidad(idEspecialidad: number): void {
    this.router.navigate(['/specialties/form', idEspecialidad]);
  }

  public cambiarEstadoEspecialidad(idEspecialidad: number): void {
    if (!confirm('¿Seguro que deseas activar/desactivar esta especialidad?')) {
      return;
    }

    this.specialtiesService.cambiarEstadoEspecialidad(idEspecialidad).subscribe(
      (response) => {
        alert('Estado de la especialidad actualizado correctamente');
        this.obtenerEspecialidades();
      },
      (error) => {
        alert('No se pudo actualizar el estado de la especialidad');
        console.error(error);
      }
    );
  }
}
