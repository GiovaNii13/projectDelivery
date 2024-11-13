import { Component, OnInit } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],

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
