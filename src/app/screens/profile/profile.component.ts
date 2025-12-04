import { Component, OnInit } from '@angular/core';
import { ProfileService, PerfilResponse } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public nombreCompleto: string = '';
  public email: string = '';
  public rol: string = '';           // admin | doctor | patient (texto)
  public telefono: string = '';

  public loading: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Si no hay token, mejor ni intentamos
    const token = this.authService.getSessionToken();
    if (!token) {
      console.warn('No hay token, no se puede cargar el perfil');
      return;
    }

    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.loading = true;

    this.profileService.getPerfil().subscribe(
      (perfil: PerfilResponse) => {
        this.loading = false;
        console.log('Perfil cargado:', perfil);

        // nombreCompleto se arma con first_name + last_name
        this.nombreCompleto = `${perfil.first_name || ''} ${perfil.last_name || ''}`.trim();
        this.email = perfil.email || '';
        this.telefono = perfil.telefono || '';
        this.rol = perfil.rol || '';
      },
      (error) => {
        this.loading = false;
        console.error('Error cargando perfil:', error);
      }
    );
  }

  public guardarPerfil(): void {
    // Partimos nombreCompleto en nombre y apellidos básicos
    const partes = (this.nombreCompleto || '').trim().split(' ');
    const first_name = partes.shift() || '';
    const last_name = partes.join(' ');

    const payload = {
      first_name,
      last_name,
      email: this.email,
      telefono: this.telefono
    };

    this.loading = true;
    this.profileService.actualizarPerfil(payload).subscribe(
      (perfilActualizado: PerfilResponse) => {
        this.loading = false;
        console.log('Perfil actualizado:', perfilActualizado);

        this.nombreCompleto =
          `${perfilActualizado.first_name || ''} ${perfilActualizado.last_name || ''}`.trim();
        this.email = perfilActualizado.email || '';
        this.telefono = perfilActualizado.telefono || '';
        this.rol = perfilActualizado.rol || '';

        alert('Perfil actualizado correctamente');
      },
      (error) => {
        this.loading = false;
        console.error('Error actualizando perfil:', error);
        alert('No se pudo actualizar el perfil');
      }
    );
  }
}
