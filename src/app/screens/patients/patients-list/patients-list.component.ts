import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {

  public pacientes: any[] = [];
  public loading: boolean = false;
  public token: string = '';
  public rol: string = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    this.rol = this.authService.getUserGroup();

    if (this.token == '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.obtenerPacientes();
  }

  public obtenerPacientes(): void {
    this.loading = true;
    this.usersService.obtenerListaPacientes().subscribe(
      (response) => {
        this.pacientes = response;
        this.loading = false;
        console.log('Lista de pacientes: ', this.pacientes);
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener la lista de pacientes');
        console.error(error);
      }
    );
  }

  public cambiarEstadoPaciente(idPaciente: number): void {
    if (!confirm('¿Seguro que deseas activar/desactivar este paciente?')) {
      return;
    }

    this.usersService.cambiarEstadoPaciente(idPaciente).subscribe(
      (response) => {
        alert('Estado del paciente actualizado correctamente');
        this.obtenerPacientes();
      },
      (error) => {
        alert('No se pudo actualizar el estado del paciente');
        console.error(error);
      }
    );
  }

    public cambiarEstado(idPaciente: number) {
    this.usersService.cambiarEstadoPaciente(idPaciente).subscribe(
      (response: any) => {
        console.log(response);
        this.obtenerPacientes();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


}
