import { Component, OnInit } from '@angular/core';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CadastroComponent, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
  email: string | undefined;
  id: string | undefined;
  name: string | undefined;
  password: string | undefined;
  updateFormGroup!: FormGroup;
  fieldDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  builderUpdateFormGroup() {
    this.updateFormGroup = this.fb.group({
      name: [this.name, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      confirmPassword: [this.password, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    })
  }
  

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

  enableForm() {
    this.updateFormGroup.get('name')?.enable();
    this.updateFormGroup.get('email')?.enable();
    this.updateFormGroup.get('password')?.enable();
    this.updateFormGroup.get('confirmPassword')?.enable();
  }

  disableForm() {
    this.updateFormGroup.get('name')?.disable();
    this.updateFormGroup.get('email')?.disable();
    this.updateFormGroup.get('password')?.disable();
    this.updateFormGroup.get('confirmPassword')?.disable();
  }

  ngOnInit(): void {
    this.getUser();
    this.builderUpdateFormGroup();
    this.disableForm();
  }
}
