import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private baseUrl: string = environment.baseUrl

  constructor( private http: HttpClient) { }

  buscarPersonal(dni: number, tipoPersona: string) {
    const url = `${this.baseUrl}/personas?nro_dni=${dni}&tipo_persona=${tipoPersona}`;
    return this.http.get<any>(url)
      .pipe(
        map(resp => {
          return resp = {
            code: resp.code,
            message: resp.message,
            content: resp.content
          }
        })
      )
  }

  traerTodosLosUsuarios() {
    const url = `${this.baseUrl}/personas`;
    return this.http.get<any>(url)
     .pipe(
       tap(resp => {
        return resp.content
       })
     )
  }
}
