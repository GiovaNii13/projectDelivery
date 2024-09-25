import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from "../cadastro/cadastro.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule, CadastroComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() logged = new EventEmitter<boolean>();

  closeLoginComponent() {
    this.close.emit();
  }
  loginFormGroup!: FormGroup;
  email = '';
  password = ''
  showPassword: boolean = false;
  registerOn: boolean = false;
  usuarioInvalido: boolean = false;
  loginInvalido: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginFormBuilder();
  }


  showPasswordOn() {
    this.showPassword = !this.showPassword;
    const password = document.getElementById('password') as HTMLInputElement;
    password.type = this.showPassword ? 'text' : 'password';
  }

  loginFormBuilder () {
    this.loginFormGroup = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(6)]]
    });
  }

  login() {
    const email = this.loginFormGroup.get('email')?.value;
    const password = this.loginFormGroup.get('password')?.value;
    this.authService.checkLogin(email, password).subscribe(users => {
      if (users.length > 0) {
        const user = users[0];
        console.log('Login bem-sucedido:', user);
        localStorage.setItem('loggedUser', JSON.stringify(user));
        this.logged.emit(true);
      } else {
        this.usuarioInvalido = true;
      }
    });
  }

  verificaValidTouchedLogin(campo: string) {
    return this.loginFormGroup.get(campo)?.invalid && (this.loginFormGroup.get(campo)?.touched);
  }

  aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouchedLogin(campo)
    }
  }

  closeRegisterComponent() {
    this.registerOn = false;
  }
}
