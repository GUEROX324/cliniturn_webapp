import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() tipo: string = '';   // ejemplo: 'registro-usuarios' o vacío
  @Input() rol: string = '';    // si no te pasan rol, se toma del AuthService

  public editar: boolean = false;
  public token: string = '';

  public activeLink: string = 'home';

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener rol y token desde cookies (igual que con FacadeService)
    const rolCookie = this.authService.getUserGroup();
    if (rolCookie && rolCookie !== '') {
      this.rol = rolCookie;
    }

    this.token = this.authService.getSessionToken();
    console.log('Navbar -> rol:', this.rol, 'token:', this.token);

    // Si la ruta trae id, asumimos modo edición (como en tu navbar viejo)
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
    }
  }

  public logout(): void {
    // Igual idea que tu viejo navbar: llama al logout y borra cookies
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout CliniTurn OK: ', response);
        this.authService.destroyUser();
        this.router.navigate(['']);
      },
      (error) => {
        console.error('Error en logout: ', error);
        this.authService.destroyUser();
        this.router.navigate(['/auth/login']);
      }
    );
  }

  public perfil(): void {
    this.router.navigate(['/profile']);
  }

  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  public clickNavLink(link: string): void {
    this.activeLink = link;

    if (link === 'home') {
      this.router.navigate(['/dashboard']);
    } else if (link === 'appointments') {
      this.router.navigate(['/appointments/list']);
    } else if (link === 'patients') {
      this.router.navigate(['/patients/list']);
    } else if (link === 'doctors') {
      this.router.navigate(['/doctors/list']);
    } else if (link === 'specialties') {
      this.router.navigate(['/specialties/list']);
    } else if (link === 'records') {
      this.router.navigate(['/records/list']);
    } else if (link === 'reports') {
      this.router.navigate(['/reports']);
    } else if (link === 'profile') {
      this.router.navigate(['/profile']);
    }
  }
}
