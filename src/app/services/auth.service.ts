import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrlUsers = 'http://localhost:3000/users'

  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrlUsers, user)
  }
}
