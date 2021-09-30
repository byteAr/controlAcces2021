import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { AllPersonal, Content } from '../../../interfaces/allPersonal.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    providers: [MessageService,ConfirmationService]
})
export class DashboardComponent implements OnInit {

  productDialog?: boolean;

  personal: any[] = [];

  persona: any;

  selectedProducts: Content[]=[];

  submitted?: boolean;

  statuses:Array<Object>=[];
  tipoDni:Array<Object>=[];
  jerarquia:Array<Object>=[];
  destino:Array<Object>=[];
  

  constructor(private messageService: MessageService, 
              private confirmationService: ConfirmationService,
              private busquedaService: BusquedaService) { }

  ngOnInit() {
    this.busquedaService.traerTodosLosUsuarios()
      .subscribe(resp => {
        this.personal = resp.content
      })

    this.statuses = [
        {label: 'UNIFORMADO', value: 'uniformado'},
        {label: 'CIVIL', value: 'civil'},
        {label: 'VISITA', value: 'visita'}
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

    openNew() {
      this.persona = {};
      this.submitted = false;
      this.productDialog = true;
    }
    deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Está seguro de eliminare a esta persona del sistema?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.personal = this.personal.filter(val => !this.selectedProducts.includes(val));
              //this.selectedProducts = null;
              this.messageService.add({severity:'success', summary: 'Operación Exitosa', detail: 'Personal Eliminado', life: 3000});
          }
      });
    }

    editProduct(persona: Content) {
        this.persona = {...persona};
        this.productDialog = true;
    }

    deleteProduct(persona: Content) {
        this.confirmationService.confirm({
            message: `Está seguro/a de eliminar a  ${persona.nombre} ${persona.apellido} ?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.personal = this.personal.filter(val => val.id !== persona.id);
                this.persona = {};
                this.messageService.add({severity:'success', summary: 'Operación Exitosa', detail: 'Personal Eliminado', life: 3000});
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.persona.name.trim()) {
            if (this.persona.id) {
                this.personal[this.findIndexById(this.persona.id)] = this.persona;
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
                this.persona.id = this.createId();
                this.persona.image = 'product-placeholder.svg';
                this.personal.push(this.persona);
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.personal = [...this.personal];
            this.productDialog = false;
            this.persona = {};
        }
    }

    findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.personal.length; i++) {
          if (this.personal[i].id === id) {
              index = i;
              break;
          }
    }

      return index;
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
