import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDoctorDeactivationModalComponent } from 'src/app/modals/confirm-doctor-deactivation-modal/confirm-doctor-deactivation-modal.component';
import { SpecialtiesService } from 'src/app/services/specialties.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {

  public doctores: any[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';
  public mapaEspecialidades: { [id: number]: string } = {};

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthService,
    public dialog: MatDialog,
    private specialtiesService: SpecialtiesService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup();

    if (this.token === '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cargarCatalogosYDoctores();
  }

  private cargarCatalogosYDoctores(): void {
    this.loading = true;

    // 1) Cargar catálogo de especialidades
    this.specialtiesService.obtenerListaEspecialidades().subscribe(
      (especialidades: any[]) => {
        this.mapaEspecialidades = {};
        especialidades.forEach(e => {
          this.mapaEspecialidades[e.id] = e.nombre;
        });
        console.log('Mapa especialidades: ', this.mapaEspecialidades);

        // 2) Ya con el mapa, cargar doctores
        this.obtenerDoctores();
      },
      (error) => {
        console.error('Error al obtener especialidades', error);
        // Si falla, igual intentamos cargar doctores pero no habrá nombres
        this.obtenerDoctores();
      }
    );
  }

  public obtenerDoctores(): void {
    this.doctorService.obtenerListaDoctores().subscribe(
      (response: any[]) => {
        console.log('Respuesta cruda doctores: ', response);

        // Para cada doctor, agregamos un campo "especialidad_nombre"
        this.doctores = response.map(doc => ({
          ...doc,
          especialidad_nombre: this.mapaEspecialidades[doc.especialidad] || 'Sin asignar'
        }));

        console.log('Doctores con nombre de especialidad: ', this.doctores);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de médicos');
        console.error(error);
      }
    );
  }

  public nuevoDoctor(): void {
    this.router.navigate(['/doctors/form']);
  }

  public editarDoctor(idDoctor: number): void {
    this.router.navigate(['/doctors/form', idDoctor]);
  }

  public abrirModalEstadoDoctor(doc: any): void {
    const dialogRef = this.dialog.open(ConfirmDoctorDeactivationModalComponent, {
      data: { id: doc.id, activo: doc.activo },
      height: '260px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isChange) {
        alert('Estado del médico actualizado correctamente');
        this.cargarCatalogosYDoctores();
      }
    });
  }
}
