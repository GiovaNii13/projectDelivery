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
  orders: any[] = [];
  Object: any;
  cartFormGroup!: FormGroup;
  paymentMethod: boolean = false;
  addresses: any[] = [];
  id: string | undefined;
  selectedAddress: any;
  selectedPaymentMethod: string = '';

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
  }

  submitOrder() {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
    const updatedOrders = this.orders.map(order => ({
      ...order,
      paymentMethod: this.selectedPaymentMethod,
      selectedAddress: this.selectedAddress
    }));
    this.authService.submitOrders(userId, updatedOrders).subscribe(response => {
      console.log('Pedido enviado:', response);
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

  ngOnInit(): void {
    this.getOrders();
    this.getAdress();
  }
}
