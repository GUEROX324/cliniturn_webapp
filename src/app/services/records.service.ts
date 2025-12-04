import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  public obtenerListaExpedientes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.url_api}/records/`, { headers });
  }

  public obtenerDetalleExpediente(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.url_api}/record/?id=${id}`, { headers });
  }

  public descargarExpediente(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // Devolvemos JSON, no Blob; el PDF se genera en el frontend
    return this.http.get<any>(`${environment.url_api}/records-download/?id=${id}`, { headers });
  }
}
