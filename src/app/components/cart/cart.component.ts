import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() orderFinish = new EventEmitter<void>();
  @Output() noAdress = new EventEmitter<void>();
  orders: any[] = [];
  Object: any;
  cartFormGroup!: FormGroup;
  paymentMethod: boolean = false;
  addresses: any[] = [];
  id: string | undefined;
  selectedAddress: any;
  selectedPaymentMethod: string | null = null;
  changeNeeded: number | null = null;
  adressOn: boolean = false;
  totalPrice: number = 0;

  constructor(
    private authService: AuthService
  ) {

  }

  closeCartComponent() {
    this.close.emit();
  }

  getOrders() {
    this.orders = this.authService.getOrders();
    console.log(this.orders)
  }

  getAdditions(additions: { [key: string]: { title: string, count: number } }) {
    return Object.values(additions);
  }

  isLastItem(additions: { [key: string]: { title: string, count: number } }, item: any): boolean {
    const items = this.getAdditions(additions);
    return items.indexOf(item) === items.length - 1;
  }

  removeOrder(orderToDelete: any) {
    this.authService.removeOrder(orderToDelete);
    this.getOrders();
    this.calculateTotalPrice(); 
  }

  submitOrder() {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
  
    if (!userId) {
      console.error("Usuário não autenticado.");
      return;
    }
  
    this.authService.getUser(userId).subscribe(user => {
      const currentOrders = user.orders || [];
      const nextOrderNumber = currentOrders.length + 1; // Calcula o próximo número do pedido
      const change = this.selectedPaymentMethod === 'Dinheiro' && this.changeNeeded
        ? this.changeNeeded - this.totalPrice
        : null;
      const currentDateTime = new Date().toISOString();
  
      const newOrder = {
        orderNumber: nextOrderNumber, // Adiciona o número do pedido
        totalPrice: this.totalPrice,
        paymentMethod: this.selectedPaymentMethod,
        change: change,
        status: 'pending',
        selectedAddress: this.selectedAddress,
        date: currentDateTime,
        order: this.orders
      };
  
      this.authService.submitOrders(userId, newOrder).subscribe(response => {
        console.log('Pedido enviado:', response);
        this.orderFinish.emit();
        this.closeCartComponent();
      });
    });
  }

  getAdress() {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
    if (userId) {
      this.authService.getUser(userId).subscribe(user => {
        if (user && user.addresses) {
          this.addresses = user.addresses;
          console.log(this.addresses)
        }
      });
    }
  }

  showSelectAdress() {
    this.adressOn = true;
    this.paymentMethod = false;
  }

  calculateTotalPrice() {
    this.totalPrice = this.orders.reduce((sum, order) => sum + order.price, 0);
  }

  returnPaymentMethod() {
    this.paymentMethod = true;
    this.adressOn = false;
  }

  returnOrderList() {
    this.paymentMethod = false;
    this.adressOn = false;
  }

  makeOrder() {
    if (this.addresses.length) {
      this.paymentMethod = true;
    } else {
      this.noAdress.emit();
      this.closeCartComponent();
    }
  }

  ngOnInit(): void {
    this.getOrders();
    this.getAdress();
    this.calculateTotalPrice();
  }
}
