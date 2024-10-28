import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { MyProfileComponent } from "./components/my-profile/my-profile.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, CommonModule, CadastroComponent, HomeComponent, MyProfileComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'projectDelivery';
  profileOn: boolean = true;
  logged: boolean = false;

  constructor() {

  }

  closeProfileComponent() {
    this.profileOn = false;
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.logged = false;
    this.profileOn = false;
  }

  ngOnInit(): void {
    
  }
}
