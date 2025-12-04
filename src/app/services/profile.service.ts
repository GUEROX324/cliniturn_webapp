import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface PerfilResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = environment.url_api;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  getPerfil(): Observable<PerfilResponse> {
    return this.http.get<PerfilResponse>(
      `${this.baseUrl}/profile/`,
      { headers: this.getHeaders() }
    );
  }

  actualizarPerfil(data: {
    first_name: string;
    last_name: string;
    email: string;
    telefono: string;
  }): Observable<PerfilResponse> {
    return this.http.put<PerfilResponse>(
      `${this.baseUrl}/profile/`,
      data,
      { headers: this.getHeaders() }
    );
  }
}
