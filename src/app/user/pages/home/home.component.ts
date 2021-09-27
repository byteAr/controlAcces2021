import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Personal } from 'src/app/interfaces/personal.interface';
import { tipoPersona } from 'src/app/interfaces/tipoPersona.interface';
import { BusquedaService } from 'src/app/services/busqueda.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tipoPersona: tipoPersona[];
  title= '';
  carga=false;
  disabled:boolean = true;  
  dni='';
  tipo = '';
  personal: Personal[] = [];

  constructor( private messageService: MessageService,
               private findUser: BusquedaService) { 
    this.tipoPersona = [
      { tipo: 'GENDARME'},
      { tipo: 'CIVIL'}
    ]
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
          this.messageService.add({severity:'success', summary:'INGRESO AUTORIZADO', detail:`Nombre y Apellido: ${resp.content[0].nombre}  ${resp.content[0].apellido} Jerarquia: ${resp.content[0].jerarquia} C.E: ${resp.content[0].codigoEstadistico}`});
        } else if (!this.dni){
          this.messageService.add({severity:'error', summary:'DEBE INGRESAR UN DNI VÁLIDO', detail:'Ingrese un DNI'});
        }
      })
      /* switch (content.code) {
        case :
          this.messageService.add({severity:'error', summary:'ACCESO DENEGADO', detail:'El DNI proporcionado no corresponde a una persona autorizada a Ingresar'});
          break;      
        case :
          this.messageService.add({severity:'success', summary:'INGRESO AUTORIZADO', detail:`aparecio nomás la persona`});
          break;
        default:
          this.messageService.add({severity:'success', summary:'', detail:`Por favor ingrese un dni válido`});
      }   */
  }

  cargar(event:any) {
    this.carga = false;
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event:any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, {type:'binary'});
      workbook.SheetNames.forEach(sheet => {
        const data: Personal[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        this.personal = data;
        console.log(data)
      })

    }
  }

}
