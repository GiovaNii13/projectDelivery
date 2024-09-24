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
  email: string | undefined;
  id: string | undefined;
  name: string | undefined;
  password: string | undefined;

  getUser() {
    const usuarioSalvo = localStorage.getItem('loggedUser');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      console.log(usuario); 
      this.email = usuario.email;
      this.name = usuario.name;
      this.password = usuario.password;
    } else {
      console.log('Nenhum usuário cadastrado.');
    }
  }

  ngOnInit(): void {
    this.getUser()
  }
}
