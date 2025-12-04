import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';         
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AppointmentsService } from 'src/app/services/appointments.service';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss']
})
export class GraficasComponent implements OnInit {
  // Datos crudos
  public labelsEspecialidades: string[] = [];
  public dataEspecialidades: number[] = [];

  public loading: boolean = false;

  // GRÁFICA DE BARRAS
  barChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Citas por especialidad',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A',
          '#31E7E7',
          '#F1C8F2'
        ]
      }
    ]
  };

  barChartOption: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end' as const,   // literal
        align: 'top' as const     // literal
      }
    }
  };

  barChartPlugins = [ DatalabelsPlugin ];

  // GRÁFICA DE PASTEL
  pieChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Citas por especialidad',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731',
          '#82D3FB',
          '#F88406',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  };

  pieChartOption: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value: number) => value,
        color: '#000'
      }
    }
  };

  pieChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.cargarCitasPorEspecialidad();
  }

  private cargarCitasPorEspecialidad(): void {
    this.loading = true;
    this.appointmentsService.getCitasPorEspecialidad().subscribe(
      (response) => {
        this.loading = false;
        console.log('Citas por especialidad: ', response);

        this.labelsEspecialidades = response.labels || [];
        this.dataEspecialidades = response.data || [];

        // Actualizar datos de bar
        this.barChartData = {
          ...this.barChartData,
          labels: [...this.labelsEspecialidades],
          datasets: [
            {
              ...this.barChartData.datasets[0],
              data: [...this.dataEspecialidades]
            }
          ]
        };

        // Actualizar datos de pie
        this.pieChartData = {
          ...this.pieChartData,
          labels: [...this.labelsEspecialidades],
          datasets: [
            {
              ...this.pieChartData.datasets[0],
              data: [...this.dataEspecialidades]
            }
          ]
        };
      },
      (error) => {
        this.loading = false;
        alert('No se pudo obtener las citas por especialidad');
        console.error(error);
      }
    );
  }
}
