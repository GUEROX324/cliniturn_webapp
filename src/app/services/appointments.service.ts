import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private authService: AuthService
  ) { }

  public esquemaCita() {
    return {
      id: null,
      paciente: null,
      medico: null,
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'Pendiente',
      consultorio: null,
      especialidad: null
    };
  }

  public validarCita(data: any, editar: boolean) {
    let error: any = {};

    if (!this.validatorService.required(data["paciente"])) {
      error["paciente"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["medico"])) {
      error["medico"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["fecha"])) {
      error["fecha"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["hora"])) {
      error["hora"] = this.errorService.required;
    }

    return error;
  }

  //servicios HTTP
  public registrarCita(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.post<any>(`${environment.url_api}/appointments/`, data, { headers: headers });
  }

  public obtenerListaCitas(): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-appointments/`, { headers: headers });
  }

  public getCitaByID(id: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/appointments/?id=${id}`, { headers: headers });
  }

  public editarCita(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.put<any>(`${environment.url_api}/appointments-edit/`, data, { headers: headers });
  }

  public eliminarCita(id: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.delete<any>(`${environment.url_api}/appointments-edit/?id=${id}`, { headers: headers });
  }

  public confirmarCita(id: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    var data = { id: id };
    return this.http.post<any>(`${environment.url_api}/appointments-confirm/`, data, { headers: headers });
  }

  public cancelarCita(id: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    var data = { id: id };
    return this.http.post<any>(`${environment.url_api}/appointments-cancel/`, data, { headers: headers });
  }

  public getCitasPorEspecialidad(): Observable<{ labels: string[]; data: number[] }> {
    const token = this.authService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<{ labels: string[]; data: number[] }>(
      `${environment.url_api}/stats/appointments-by-specialty/`,
      { headers }
    );
  }

  public getCitasPorMedicoYFecha(medicoId: number, fecha: string): Observable<any[]> {
  const token = this.authService.getSessionToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  // Usa el mismo endpoint /appointments/ con filtros medico_id y fecha
  return this.http.get<any[]>(
    `${environment.url_api}/appointments/?medico_id=${medicoId}&fecha=${fecha}`,
    { headers: headers }
  );
}

}
