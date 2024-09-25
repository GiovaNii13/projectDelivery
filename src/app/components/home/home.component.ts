import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, CadastroComponent, MyProfileComponent, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  loginOn: boolean = false;
  logged: boolean = false;
  makeRegister: boolean = false;
  profileOn: boolean = false;

  constructor(
    private messageService: MessageService
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


  ngOnInit(): void {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      this.logged = true; 
    }
  }
}
