import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrlUsers = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrlUsers, user);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrlUsers);
  }

  checkLogin(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrlUsers}?email=${email}&password=${password}`);
  }

  updateUser(user: any) {
    const loggedUser = localStorage.getItem('loggedUser');
    const id = loggedUser ? JSON.parse(loggedUser).id : null;
    return this.http.put<any>(`${this.baseUrlUsers}/${id}`, user);
  }

  deleteUser() {
    const loggedUser = localStorage.getItem('loggedUser');
    const id = loggedUser ? JSON.parse(loggedUser).id : null;
    return this.http.delete<any>(`${this.baseUrlUsers}/${id}`);
  }

  consultaCep(cep: string) {
    cep = cep.replace(/\D/g, '');
    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)){
        return this.http.get(`//viacep.com.br/ws/${cep}/json/`);
      }
    }
    return of({})
  }
}
