import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import { RecordsService } from 'src/app/services/records.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public resumen: any = {};
  public kpis: any = {};
  public expedientes: any[] = [];

  public loadingResumen: boolean = false;
  public loadingKpis: boolean = false;
  public loadingExpedientes: boolean = false;

  public errorResumen: string = '';
  public errorKpis: string = '';
  public errorExpedientes: string = '';

  constructor(
    private reportsService: ReportsService,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarKpis();
    this.cargarExpedientes();
  }

  public cargarResumen(): void {
    this.loadingResumen = true;
    this.errorResumen = '';

    this.reportsService.obtenerResumen().subscribe(
      (response: any) => {
        this.resumen = response;
        this.loadingResumen = false;
      },
      (error: any) => {
        console.error('Error al obtener resumen: ', error);
        this.errorResumen = 'No se pudo cargar el resumen de reportes.';
        this.loadingResumen = false;
      }
    );
  }

  public cargarKpis(): void {
    this.loadingKpis = true;
    this.errorKpis = '';

    this.reportsService.obtenerKpis().subscribe(
      (response: any) => {
        this.kpis = response;
        this.loadingKpis = false;
      },
      (error: any) => {
        console.error('Error al obtener KPIs: ', error);
        this.errorKpis = 'No se pudieron cargar los KPIs.';
        this.loadingKpis = false;
      }
    );
  }

  public cargarExpedientes(): void {
    this.loadingExpedientes = true;
    this.errorExpedientes = '';

    this.recordsService.obtenerListaExpedientes().subscribe(
      (response: any) => {
        // Si el backend regresa un array directo
        this.expedientes = response || [];
        // Si tu backend regresa algo como { records: [...] }, cambia a:
        // this.expedientes = response.records || [];
        this.loadingExpedientes = false;
      },
      (error: any) => {
        console.error('Error al obtener expedientes: ', error);
        this.errorExpedientes = 'No se pudo cargar la lista de expedientes.';
        this.loadingExpedientes = false;
      }
    );
  }
}
