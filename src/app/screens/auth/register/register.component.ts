import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: any = {};
  public errores: any = {};
  public loading: boolean = false;

  public rol: string = 'paciente';
  public esAdminLogueado: boolean = false;

  constructor(
    private usersService: UsersService,
    private administradoresService: AdministradoresService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const grupo = this.authService.getUserGroup();

    if (grupo === 'administrador') {
      this.esAdminLogueado = true;
    } else {
      this.esAdminLogueado = false;
    }

    this.initForm();
  }

  initForm(): void {
    this.errores = {};
    this.user = this.usersService.esquemaPaciente();
    // aseguramos que exista la propiedad edad
    if (this.user.edad === undefined) {
      this.user.edad = null;
    }
  }

  onSubmitRegister(): void {
    this.errores = {};
    this.loading = true;

    const email: string = (this.user.email || '').toString().trim();

    // regla: si lleva @admin => administrador, si no => paciente
    if (email.includes('@admin')) {
      this.rol = 'administrador';
    } else {
      this.rol = 'paciente';
    }

    // ======================
    //  REGISTRO PACIENTE
    // ======================
    if (this.rol === 'paciente') {
      this.user.rol = 'paciente';

      this.errores = this.usersService.validarPaciente(this.user, false);
      if (Object.keys(this.errores).length > 0) {
        this.loading = false;
        return;
      }

      const payload: any = { ...this.user };

      if (payload.nombre) {
        const partes = payload.nombre.toString().trim().split(' ');
        payload.first_name = partes.shift() || '';
        payload.last_name = partes.join(' ') || '';
      }

      delete payload.nombre;
      // 👇 Paciente NO tiene campo edad en el modelo, lo quitamos
      if (payload.edad !== undefined) {
        delete payload.edad;
      }

      this.usersService.registrarPaciente(payload).subscribe(
        (response: any) => {
          alert('Paciente registrado correctamente');
          this.loading = false;
          this.router.navigate(['/auth/login']);
        },
        (error: any) => {
          console.error(error);
          alert('No se pudo registrar el paciente');
          this.loading = false;
        }
      );

    // ======================
    //  REGISTRO ADMIN
    // ======================
    } else if (this.rol === 'administrador') {

      const payload: any = { ...this.user };

      payload.rol = 'administrador';

      if (payload.nombre) {
        const partes = payload.nombre.toString().trim().split(' ');
        payload.first_name = partes.shift() || '';
        payload.last_name = partes.join(' ') || '';
      }

      // edad viene del formulario
      payload.edad = Number(payload.edad);

      payload.clave_admin = payload.matricula || `ADM-${Date.now()}`;
      payload.telefono    = payload.telefono || '';
      payload.rfc         = payload.rfc || 'XAXX010101000';
      payload.ocupacion   = payload.ocupacion || 'Administrador';

      delete payload.nombre;

      this.errores = this.administradoresService.validarAdmin(payload, false);
      if (Object.keys(this.errores).length > 0) {
        this.loading = false;
        return;
      }

      this.administradoresService.registrarAdmin(payload).subscribe(
        (response: any) => {
          alert('Administrador registrado correctamente');
          this.loading = false;
          this.router.navigate(['/auth/login']);
        },
        (error: any) => {
          console.error(error);
          alert('No se pudo registrar el administrador');
          this.loading = false;
        }
      );

    // ======================
    //  REGISTRO MÉDICO 
    // ======================
    } else if (this.rol === 'medico') {
      this.user.rol = 'medico';

      this.errores = this.doctorService.validarDoctor(this.user, false);
      if (Object.keys(this.errores).length > 0) {
        this.loading = false;
        return;
      }

      this.doctorService.registrarDoctor(this.user).subscribe(
        (response: any) => {
          alert('Médico registrado correctamente');
          this.loading = false;
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error(error);
          alert('No se pudo registrar el médico');
          this.loading = false;
        }
      );

    } else {
      this.loading = false;
    }
  }
}
