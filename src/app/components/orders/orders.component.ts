import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  orders: any[] = [];

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
    this.authService.getUserOrders(userId).subscribe(orders => {
      this.orders = orders.reverse(); // Inverte a ordem dos pedidos
      console.log('Pedidos do usuário:', this.orders);
    });
  }

  objectToArray(obj: any): any[] {
    return Object.values(obj || {});
  }

  closeOrderComponent(): void {
    this.close.emit();
  }
}
