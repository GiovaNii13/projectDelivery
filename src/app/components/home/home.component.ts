import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from '../cadastro/cadastro.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, CadastroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  loginOn: boolean = false;
  logged: boolean = false;
  makeRegister: boolean = false;

  constructor() {
  }

  closeComponent() {
    this.loginOn = false;
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
      console.log('Está logado')
    } else {
      this.loginOn = true;
    }
  }

  shoppingCartOn() {
    if(this.logged) {
      console.log('Está logado')
    } else {
      this.loginOn = true;
    }
  }

  ngOnInit(): void {
      
  }
}
