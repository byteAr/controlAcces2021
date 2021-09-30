import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { ResponseCreatedNewUser } from '../interfaces/responseCreatedANewUser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = environment.baseUrl

  constructor(private http: HttpClient ) { }



  createUser = (nombre: string, apellido: string, tipoDni: string, numeroDni: string, tipoPersona: string,   destinoHabitual: string, codigoEstadistico: string, createdUser: string = 'admin2', jerarquia?: string, ) => {
    const persona = {
      nombre,
      apellido,
      tipoDni,
      numeroDni,
      tipoPersona,
      jerarquia,
      createdUser,
      destinoHabitual,
      codigoEstadistico
    }
    return this.http.post<ResponseCreatedNewUser>(`${this.baseUrl}/persona`, persona)
  }

  entryEvent = (id: string, destinationName: string, action: string = "ENTRADA", createdUser: string = "ADMIN") => {
    const entrada = {
      id_persona: id,
      action,
      destinationName,
      createdUser
    }
    return this.http.post(`${this.baseUrl}/processrecord`, entrada);
  }
}
