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

  statuses?: any[];
  

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
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
          }
      });
    }

    editProduct(persona: Content) {
        this.persona = {...persona};
        this.productDialog = true;
    }

    deleteProduct(persona: Content) {
        this.confirmationService.confirm({
            message: 'Está seguro de que desea eliminar a ' + persona.nombre + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.personal = this.personal.filter(val => val.id !== persona.id);
                this.persona = {};
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
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
