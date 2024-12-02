import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from "../cadastro/cadastro.component";
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CadastroComponent, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() logged = new EventEmitter<boolean>();
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();

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
    private messageService: MessageService,
    private authService: AuthService
  ) {}

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
  
    this.authService.checkLogin(email).subscribe(users => {
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          console.log('Login bem-sucedido:', user);
          localStorage.setItem('loggedUser', JSON.stringify(user));
          this.logged.emit(true);
          this.loginSuccess.emit();
        } else {
          this.usuarioInvalido = true;
          console.log('Senha inválida');
        }
      } else {
        this.usuarioInvalido = true;
        console.log('Usuário não encontrado');
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

  showRegisterSuccess() {
    this.registerSuccess.emit();
  }

  ngOnInit(): void {
    this.loginFormBuilder();
  }
}
