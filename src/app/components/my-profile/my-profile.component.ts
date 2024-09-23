import { Component, OnInit } from '@angular/core';
import { CadastroComponent } from '../cadastro/cadastro.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CadastroComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {

  ngOnInit(): void {
    
  }
}
