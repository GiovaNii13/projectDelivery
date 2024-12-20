import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrlUsers = 'http://localhost:3000/users';
  baseUrlProducts = 'http://localhost:3000/products';
  baseUrlSimpleProducts = 'http://localhost:3000/simpleProducts';
  baseUrlFreeAdds = 'http://localhost:3000/freeAdds';
  baseUrlSpecialAdds = 'http://localhost:3000/specialAdds';
  baseUrlOrders = 'http://localhost:3000/orders';
  private orders: any[] = [];
  private finallyOrders: any[] = [];
  constructor(
    private http: HttpClient
  ) {
    this.loadOrders();
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrlUsers, user);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlUsers);
  }

  checkLogin(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlUsers}?email=${email}`);
  }

  getUser(userId: any): Observable<any> {
    const url = `http://localhost:3000/users/${userId}`;
    return this.http.get(url);
  }

  updateUser(user: any) {
    return this.http.put<any>(`${this.baseUrlUsers}/${user.id}`, user);
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.baseUrlUsers}/${id}`);
  }

  deleteUser() {
    const loggedUser = localStorage.getItem('loggedUser');
    const id = loggedUser ? JSON.parse(loggedUser).id : null;
    return this.http.delete<any>(`${this.baseUrlUsers}/${id}`);
  }

  checkCepService(cep: string) {
    cep = cep.replace(/\D/g, '');
    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)){
        return this.http.get(`//viacep.com.br/ws/${cep}/json/`);
      }
    }
    return of({})
  }

  addAddress(userId: string, addressData: any): Observable<any> {
    const url = `${this.baseUrlUsers}/${userId}`;
    
    return this.http.get(url).pipe(
      switchMap((user: any) => {
        const currentAddresses = user.addresses || [];
        const newAddress = { ...addressData, id: currentAddresses.length + 1 };
        return this.http.patch(url, {
          addresses: [...currentAddresses, newAddress]
        });
      })
    );
  }

  updateAddress(userId: string, addressId: string, addressData: any): Observable<any> {
    const url = `${this.baseUrlUsers}/${userId}`;
    return this.http.get(url).pipe(
      switchMap((user: any) => {
        const addressIndex = user.addresses.findIndex((addr: any) => addr.id === addressId);
        if (addressIndex !== -1) {
          user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...addressData };
          return this.http.patch(url, { addresses: user.addresses });
        } else {
          throw new Error('Endereço não encontrado');
        }
      })
    );
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    const url = `${this.baseUrlUsers}/${userId}`;
    return this.http.get(url).pipe(
      switchMap((user: any) => {
        const updatedAddresses = user.addresses.filter((address: any) => address.id !== addressId);
        return this.http.patch(url, { addresses: updatedAddresses });
      })
    );
  }

  private saveOrders() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  private loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    this.orders = savedOrders ? JSON.parse(savedOrders) : [];
  }

  addOrder(order: any) {
    this.orders.push(order);
    this.saveOrders();
  }

  getOrders() {
    return this.orders;
  }

  clearOrders() {
    this.orders = [];
    localStorage.removeItem('orders');
  }

  removeOrder(orderToDelete: any) {
    this.orders = this.orders.filter(order => order !== orderToDelete);
    this.saveOrders();
  }

  submitOrders(userId: string, newOrder: any): Observable<any> {
    const url = `${this.baseUrlUsers}/${userId}`;
    return this.http.get(url).pipe(
      switchMap((user: any) => {
        const currentOrders = user.orders || [];
        const updatedOrders = [...currentOrders, newOrder];
        return this.http.patch(url, { orders: updatedOrders });
      }),
      switchMap((response) => {
        this.clearOrders();
        return of(response);
      })
    );
  }

  getUserOrders(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrlUsers}/${userId}`).pipe(
      switchMap(user => of(user.orders || []))
    );
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlProducts);
  }

  getSimpleProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlSimpleProducts);
  }

  getSizeProducts(id: any): Observable<any> {
    return this.http.get(`${this.baseUrlSimpleProducts}/${id}`);
  }

  getFreeAdss(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlFreeAdds);
  }

  getSpecialAdds(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlSpecialAdds);
  }
}
