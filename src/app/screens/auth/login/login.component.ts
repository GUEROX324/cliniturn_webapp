import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public username: string = '';
  public password: string = '';
  public errores: any = {};
  public loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  iniciarSesion(): void {
    this.errores = {};

    this.errores = this.authService.validarLogin(this.username, this.password);
    if (Object.keys(this.errores).length > 0) {
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        this.authService.saveUserData(response);
        const rol = response.rol;
        if (rol === 'paciente' || rol === 'administrador' || rol === 'medico') {
          this.router.navigate(['/dashboard']);
        } else {
          alert('Rol no reconocido');
          this.router.navigate(['/auth/login']);
        }
        this.loading = false;
      },
      (error: any) => {
        console.error(error);
        // Mensaje genérico de error de login
        this.errores['password'] = 'Usuario o contraseña incorrectos';
        this.loading = false;
      }
    );
  }
}
