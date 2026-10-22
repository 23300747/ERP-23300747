import { Injectable } from '@angular/core';
import { CallbackHttp, postJSON } from './http-cliente';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly url = 'http://localhost:3000/api/sesion';

  iniciarSesion(correo: string, contrasena: string, callback: CallbackHttp): void {
    postJSON(`${this.url}/login`, { correo, contrasena }, callback);
  }

  registrarCliente(datos: any, callback: CallbackHttp): void {
    postJSON(`${this.url}/registro`, datos, callback);
  }
}
