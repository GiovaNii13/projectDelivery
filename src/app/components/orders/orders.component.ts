import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  orders: any[] = [];

  constructor(
    private authService: AuthService
  ) {

  }

  getOrders() {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
    this.authService.getUserOrders(userId).subscribe(orders => {
      this.orders = orders
      console.log('Pedidos do usuário:', orders);
    })
  }

  closeOrderComponent() {
    this.close.emit();
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
