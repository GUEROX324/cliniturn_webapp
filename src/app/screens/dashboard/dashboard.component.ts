import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public rol: string = '';
  public token: string = '';
  public nombreUsuario: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();

    if (!this.token || this.token === '') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.rol = this.authService.getUserGroup();
    this.nombreUsuario = this.authService.getUserCompleteName();
  }

  public logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.authService.destroyUser();
        this.router.navigate(['/']);
      },
      () => {
        this.authService.destroyUser();
        this.router.navigate(['/']);
      }
    );
  }

}
