// src/app/services/consultorios.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultoriosService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private validatorService: ValidatorService,
    private errorService: ErrorsService
  ) {}

  public esquemaConsultorio() {
    return {
      id: null,
      nombre: '',
      edificio: '',
      piso: '',
      numero: '',
      disponible: true
    };
  }

  public validarConsultorio(data: any, editar: boolean) {
    let error: any = [];

    if (!this.validatorService.required(data['nombre'])) {
      error['nombre'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['edificio'])) {
      error['edificio'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['numero'])) {
      error['numero'] = this.errorService.required;
    }

    return error;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  //SERVICIOS HTTP

  public registrarConsultorio(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${environment.url_api}/consultorios/`,
      data,
      { headers }
    );
  }

  public obtenerListaConsultorios(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${environment.url_api}/consultorios/all/`,
      { headers }
    );
  }

  public obtenerConsultorioByID(idConsultorio: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${environment.url_api}/consultorios/?id=${idConsultorio}`,
      { headers }
    );
  }

  public editarConsultorio(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${environment.url_api}/consultorios/edit/`,
      data,
      { headers }
    );
  }

  public cambiarEstadoConsultorio(idConsultorio: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${environment.url_api}/consultorios/change-status/?id=${idConsultorio}`,
      {},
      { headers }
    );
  }

  public obtenerConsultoriosDisponibles(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${environment.url_api}/consultorios/disponibles/`,
      { headers }
    );
  }
}
