import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ExtrasComponent } from '../extras/extras.component';
import { CartComponent } from '../cart/cart.component';
import { OrdersComponent } from "../orders/orders.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, MyProfileComponent, ToastModule, ExtrasComponent, CartComponent, OrdersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  loginOn: boolean = false;
  logged: boolean = false;
  makeRegister: boolean = false;
  extrasOn: boolean = false;
  profileOn: boolean = false;
  mountYours: boolean = true;
  acaiReady: boolean = false;
  readyProducts: any[] = [];
  sizesProducts: any[] = [];
  selectedProduct: any = null;
  cartOn: boolean = false;
  orderOn: boolean = false;
  orders: any[] = [];

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao realizar operação' });
  }
  closeComponent() {
    this.loginOn = false;
  }

  closeProfileComponent() {
    this.profileOn = false;
  }

  userOn() {
    if(this.logged) {
      console.log('Está logado')
    } else {
      this.loginOn = true;
    }
  }

  ordersOn() {
    if(this.logged) {
      this.orderOn = true;
    } else {
      this.loginOn = true;
    }
  }

  shoppingCartOn() {
    if(this.logged) {
      this.cartOn = true;
    } else {
      this.loginOn = true;
    }
  }
  
  onLoginSuccess(loggedIn: boolean) {
    console.log('Login status recebido no HomeComponent:', loggedIn);
    this.logged = loggedIn;
    this.loginOn = false;
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.logged = false;
    this.profileOn = false;
  }

  showMountYoursContent() {
    this.acaiReady = false;
    this.mountYours = true;
  }

  showAcaiReadyContent() {
    this.mountYours = false;
    this.acaiReady = true;
  }

  getProducts() {
    this.authService.getProducts().subscribe(products => {
      this.readyProducts = products
      console.log('getProducts acionado')
      console.log(this.readyProducts)
    })
  }

  getSizesProducts() {
    this.authService.getSimpleProducts().subscribe(products => {
      this.sizesProducts = products
      console.log('getProducts acionado')
      console.log(this.readyProducts)
    })
  }

  openExtras(sizeProduct: any) {
    this.selectedProduct = sizeProduct;
    this.extrasOn = true;
}

  closeExtrasComponent() {
    this.extrasOn = false;
  }

  closeCartComponent() {
    this.cartOn = false;
    this.getOrders();
  }

  closeOrderComponent() {
    this.orderOn = false;
  }

  getOrders() {
    this.orders = this.authService.getOrders();
  }

  ngOnInit(): void {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      this.logged = true; 
    }
    this.getProducts();
    this.getSizesProducts();
    this.getOrders();
  }
}
