import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Personal } from 'src/app/interfaces/personal.interface';
import { tipoPersona } from 'src/app/interfaces/tipoPersona.interface';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class HomeComponent implements OnInit {

  tipoPersona: tipoPersona[];
  title= '';
  carga=false;
  disabled:boolean = true;  
  dni='';
  tipo = '';
  personal: Personal[] = [];
  persona: any;
  submitted?: boolean;
  productDialog?: boolean;

  statuses:Array<Object>=[];
  tipoDni:Array<Object>=[];
  jerarquia:Array<Object>=[];
  destino:Array<Object>=[];

  constructor( private messageService: MessageService,
               private confirmationService: ConfirmationService,
               private findUser: BusquedaService,
               private userService: UsersService) { 
    this.tipoPersona = [
      { tipo: 'GENDARME'},
      { tipo: 'CIVIL'}
    ]

    this.statuses = [
      {label: 'GENDARME', value: 'GENDARME'},
      {label: 'CIVIL', value: 'CIVIL'},
      {label: 'INVITADO', value: 'INVITADO'}
  ];
  this.tipoDni = [
      {label: 'DNI 1', value: 'DNI 1'},
      {label: 'DNI 2', value: 'DNI 2'},
      {label: 'DNI 3', value: 'DNI 3'}
  ];
  this.jerarquia = [
      {label: 'GENDARME', value: 'GEND'},
      {label: 'CABO', value: 'CBO'},
      {label: 'CABO PRIMERO', value: 'CBO_1RO'},
      {label: 'SARGENTO', value: 'SARG'},
      {label: 'SARGENTO PRIMERO', value: 'SARG_1RO'},
      {label: 'SARGENTO AYTUDANTE', value: 'SARG_AY'},
      {label: 'SUBOFICIAL PRINCIPAL', value: 'SUBOF_PR'},
      {label: 'SUBOFICIAL MAYOR', value: 'SUBOF_MY'},
      {label: 'SUBALFEREZ', value: 'SUB_ALF'},
      {label: 'ALFEREZ', value: 'ALF'},
      {label: 'PRIMER ALFEREZ', value: '1ER_ALF'},
      {label: 'SEGUNDO COMANDANTE', value: '2DO_CTE'},
      {label: 'COMANDANTE', value: 'CTE'},
      {label: 'COMANDANTE PRINCIPAL', value: 'CTE_PR'},
      {label: 'COMANDANTE MAYOR', value: 'CTE_MY'},
      {label: 'COMANDANTE GENERAL', value: 'CTE_GRL'}
  ];
  this.destino = [
      {label: 'PLANTA BAJA', value: 'GEND'},
      {label: 'PISO 1', value: 'PISO 1'},
      {label: 'PISO 2', value: 'PISO 2'},
      {label: 'PISO 3', value: 'PISO 3'},
      {label: 'PISO 4', value: 'PISO 4'},
      {label: 'PISO 5', value: 'PISO 5'},
      {label: 'PISO 6', value: 'PISO 6'},
      {label: 'PISO 7', value: 'PISO 7'},
      {label: 'PISO 8', value: 'PISO 8'},
      {label: 'PISO 9', value: 'PISO 9'},
      {label: 'PISO 10', value: 'PISO 10'},
      {label: 'PISO 11', value: 'PISO 11'},
      {label: 'COMEDOR', value: 'COMEDOR'},
  ];
  }

  ngOnInit(): void {
  }

  auth() {
    const dni = parseInt(this.dni);
    const personaEncontrada = this.personal.find((persona:Personal) => {
      return dni == persona.DNI
    })
 
    switch(personaEncontrada) {
      case undefined:
        this.messageService.add({severity:'error', summary:'ACCESO DENEGADO', detail:'El DNI proporcionado no corresponde a una persona autorizada a Ingresar'});
        break;      
      case personaEncontrada:
        this.messageService.add({severity:'success', summary:'INGRESO AUTORIZADO', detail:`${personaEncontrada?.NOMBRE} ${personaEncontrada?.APELLIDO} - ${personaEncontrada?.DESTINO}`});
        break;
      default:
        this.messageService.add({severity:'success', summary:'', detail:`Por favor ingrese un dni válido`});
    }    
    
  }

  

  search() {
    const dni = parseInt(this.dni);
    const content = this.findUser.buscarPersonal(dni, 'GENDARME')
      .subscribe(resp => {
        if (resp.code == "200") {
          const { nombre, apellido, codigoEstadistico, jerarquia, id, destinoHabitual } = resp.content[0]
          this.messageService.add({severity:'success', summary:'INGRESO AUTORIZADO', detail:`Nombre y Apellido: ${nombre}  ${apellido} Jerarquia: ${jerarquia} C.E: ${codigoEstadistico} DESTINO: ${destinoHabitual}`});
          this.userService.entryEvent(id, destinoHabitual)
            .subscribe(resp => {
              console.log(resp);
            })
        } else if (!this.dni){
          this.messageService.add({severity:'error', summary:'DEBE INGRESAR UN DNI VÁLIDO', detail:'Ingrese un DNI'});
        } else if ( resp.code == "410") {          
          this.openNew();
        }
      })
      
  }

  openNew() {
    this.persona = {};
    this.submitted = false;
    this.productDialog = true;
  }

  questionsNewUser() {
    this.confirmationService.confirm({
      message: 'Está persona no se encuentra registrada en el sistema, desea registrarla?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.openNew();
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;
      const {nombre, apellido, tipoDni, numeroDni, tipoPersona, jerarquia, createdUser, destinoHabitual, codigoEstadistico} = this.persona;
      this.userService.createUser(nombre, apellido, tipoDni, numeroDni, tipoPersona, destinoHabitual,  codigoEstadistico, createdUser, jerarquia )
        .subscribe(resp => {
          console.log(resp);
          if(resp.code == "200") {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Usuario Creado Exitosamente', life: 7000});
          } else {
            this.messageService.add({severity:'error', summary: 'Successful', detail: `${resp.message}`, life: 7000});
          }
          this.productDialog = false;
        })

      
  }



 

createId(): string {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


}
