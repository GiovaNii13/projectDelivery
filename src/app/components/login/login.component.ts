import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from "../cadastro/cadastro.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule, CadastroComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  closeLoginComponent() {
    this.close.emit();
  }
  loginFormGroup!: FormGroup;
  email = 'giovani.a.n13@gmail.com';
  password = 'Teste123'
  showPassword: boolean = false;
  registerOn: boolean = false;

  constructor(
    private fb: FormBuilder
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

  teste() {
    console.log(this.loginFormGroup.value);
  }

  closeRegisterComponent() {
    this.registerOn = false;
  }
}
