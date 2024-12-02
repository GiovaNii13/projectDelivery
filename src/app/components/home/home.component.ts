import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
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
  showExtrasComponent = true;
  successMessage: string | null = null;
  userName!: any;
  clickedIndex: number | null = null;
  userType!: number;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  showToastMessage(type: any, title: any, message: any) {
    this.messageService.add({ severity: type, summary: title, detail: message });
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
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Você saiu da sua conta!',
    });
  }

  showDeleteMessage() {
    localStorage.removeItem('loggedUser');
    this.logged = false;
    this.profileOn = false;
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Você deletou sua conta!',
    });
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
    if(this.logged) {
      this.selectedProduct = sizeProduct;
      this.extrasOn = true;
    } else {
      this.loginOn = true;
    }
    
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

  showSuccessToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Açaí adicionado ao carrinho!',
    });
  }

  showSuccessLogin() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Seja bem vindo',
    });
  }

  showSuccessOrder() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Pedido realizado!',
    });
  }

  showSuccessReadyOrder(title: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${title} adicionado ao carrinho!`,
    });
  }

  showErrorAdress() {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Entre no seu perfil e adicione um endereço para fazer o seu pedido!',
    });
  }
  
  getUser() {
    const usuarioSalvo = localStorage.getItem('loggedUser');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.userName = usuario.name;
      this.userType = usuario.type;
      console.log(this.userType)
    }
  }

  addToCart(product: any) {
    const order = {
        productImage: product.image,
        productTitle: product.title,
        freeAdds: product.freeAdds,
        specialAdds: {},
        observation: null,
        price: product.price,
    };
    this.authService.addOrder(order);
    this.showSuccessReadyOrder(order.productTitle)
    console.log('Produto adicionado ao carrinho:', order);
  }

  objectToArray(obj: any): any[] {
    return Object.keys(obj).map(key => obj[key]);
  }

  isLastItem(additions: any, item: any): boolean {
    const additionsArray = Object.values(additions);
    return additionsArray[additionsArray.length - 1] === item;
  }

  handleCardClick(product: any, index: number) {
    if (this.logged) {
      this.addToCart(product);
      this.clickedIndex = index;
      setTimeout(() => {
        this.clickedIndex = null;
      }, 500);
    } else {
      this.loginOn = true;
    }
  }

  onRegisterSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Cadastro realizado!',
    });
  }

  ngOnInit(): void {
    this.getUser();
    const user = localStorage.getItem('loggedUser');
    if (user) {
      this.logged = true; 
    }
    this.getProducts();
    this.getSizesProducts();
    this.getOrders();
  }
}
