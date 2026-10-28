// cuenta los reportes generados durante la sesion.
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  readonly generados = signal(0);

  registrarGeneracion(): void {
    this.generados.update(total => total + 1);
  }
}
