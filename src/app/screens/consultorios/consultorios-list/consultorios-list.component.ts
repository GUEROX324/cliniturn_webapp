import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultoriosService } from 'src/app/services/consultorios.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-consultorios-list',
  templateUrl: './consultorios-list.component.html',
  styleUrls: ['./consultorios-list.component.scss']
})
export class ConsultoriosListComponent implements OnInit {

  public consultorios: any[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';

  constructor(
    private router: Router,
    private consultoriosService: ConsultoriosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup();

    if (this.token == '' || this.rol !== 'administrador') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.obtenerConsultorios();
  }

  public obtenerConsultorios(): void {
    this.loading = true;
    this.consultoriosService.obtenerListaConsultorios().subscribe(
      (response) => {
        this.consultorios = response;
        this.loading = false;
        console.log('Lista de consultorios: ', this.consultorios);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de consultorios');
        console.error(error);
      }
    );
  }

  public nuevoConsultorio(): void {
    this.router.navigate(['/consultorios/form']);
  }

  public editarConsultorio(idConsultorio: number): void {
    this.router.navigate(['/consultorios/form', idConsultorio]);
  }

  public cambiarEstadoConsultorio(idConsultorio: number): void {
    if (!confirm('¿Seguro que deseas activar/desactivar este consultorio?')) {
      return;
    }

    this.consultoriosService.cambiarEstadoConsultorio(idConsultorio).subscribe(
      () => {
        alert('Estado del consultorio actualizado correctamente');
        this.obtenerConsultorios();
      },
      (error) => {
        alert('No se pudo actualizar el estado del consultorio');
        console.error(error);
      }
    );
  }
}
