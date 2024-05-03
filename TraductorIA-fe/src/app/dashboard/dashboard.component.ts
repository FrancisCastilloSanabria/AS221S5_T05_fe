import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './api.service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  traducciones: any[] = [];
  horaActual: string = '';
  fechaActual: string = '';
  palabra_ingresada: string = '';
  palabra_traducida: string = '';

  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.cargarTraducciones();
    this.actualizarFechaYHora();
  }

  cargarTraducciones() {
    this.apiService.getTraduccionesGuardadas().subscribe(
      data => {
        this.traducciones = data;
        console.log(data);
      },
      error => {
        console.log('Error al cargar las traducciones:', error);
      }
    );
  }

  traducirPalabra() {
    this.apiService.traducirPalabra(this.palabra_ingresada).subscribe(
      (response: any) => {
        this.palabra_traducida = response[0].translations[0].text;
        this.apiService.guardarTraduccion(this.palabra_ingresada, this.palabra_traducida).subscribe(
          (data: any) => {
            console.log('Traducción guardada:', data);
            this.cargarTraducciones();
          },
          error => {
            console.error('Error al guardar la traducción:', error);
          }
        );
      },
      error => {
        console.error('Error al traducir la palabra:', error);
      }
    );
  }

  eliminarTraduccion(id: number) {
    if (!id) {
      console.error('ID de traducción no válido:', id);
      return;
    }
  
    this.apiService.eliminarTraduccion(id).subscribe(
      () => {
        console.log(`Traducción con ID ${id} eliminada exitosamente.`);
        this.cargarTraducciones(); // Actualizar la lista después de eliminar
      },
      error => {
        console.error('Error al eliminar la traducción:', error);
      }
    );
  }
  
  actualizarFechaYHora() {
    setInterval(() => {
      const ahora = new Date();
      const diaSemana = this.obtenerNombreDiaSemana(ahora.getDay());
      const dia = ahora.getDate();
      const mes = this.obtenerNombreMes(ahora.getMonth());
      const año = ahora.getFullYear();
      const hora = ahora.toLocaleTimeString();
      this.horaActual = hora;
      this.fechaActual = `${diaSemana} ${dia} de ${mes} de ${año}`;
    }, 1000);
  }

  obtenerNombreDiaSemana(dia: number): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[dia];
  }

  obtenerNombreMes(mes: number): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes];
  }
}