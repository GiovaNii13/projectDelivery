import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  registerFormGroup!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  disabledBtn: boolean = false;
  invalidFields: boolean = false;
  diferentsPasswords: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeRegisterComponent() {
    this.close.emit();
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  cadastroFormBuilder() {
    this.registerFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    }, { validator: this.checkPasswords });
  }

  showPasswordOn() {
    this.showPassword = !this.showPassword;
    const password = document.getElementById('password') as HTMLInputElement;
    password.type = this.showPassword ? 'text' : 'password';
  }


  showPasswordConfirmOn() {
    this.showConfirmPassword = !this.showConfirmPassword;
    const password = document.getElementById('confirmPassword') as HTMLInputElement;
    password.type = this.showConfirmPassword ? 'text' : 'password';
  }

  registerSubmit() {
    if (this.registerFormGroup.valid) {
      const password = this.registerFormGroup.get('password')?.value;
      const confirmPassword = this.registerFormGroup.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        return;
      }
      const userData = {
        name: this.registerFormGroup.get('name')?.value,
        email: this.registerFormGroup.get('email')?.value,
        password: password
      };
      this.authService.registerUser(userData).subscribe(
        response => {
          console.log('Usuário cadastrado com sucesso:', response);
          this.closeRegisterComponent();
        },
        error => {
          console.error('Erro ao cadastrar o usuário:', error);
        }
      );
    } else {
      this.invalidFields = true;
    }
  }

  aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouchedLogin(campo)
    }
  }

  verificaValidTouchedLogin(campo: string) {
    return this.registerFormGroup.get(campo)?.invalid && (this.registerFormGroup.get(campo)?.touched);
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onFocusConfirmPassword() {
    this.registerFormGroup.get('confirmPassword')?.setErrors(null);
  }

  ngOnInit(): void {
    this.cadastroFormBuilder();
  }
}
