import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CadastroComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  email: string | undefined;
  id: string | undefined;
  name: string | undefined;
  password: string | undefined;
  updateFormGroup!: FormGroup;
  fieldDisabled: boolean = true;
  editOn: boolean = false;
  deleteOn: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  logouting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  closeProfileComponent() {
    this.close.emit();
  }

  logoutUser() {
    this.logout.emit();
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
      this.id = usuario.id;
      this.email = usuario.email;
      this.name = usuario.name;
      this.password = usuario.password;
    }
  }

  enableForm() {
    this.editOn = true;
    this.updateFormGroup.get('name')?.enable();
    this.updateFormGroup.get('email')?.enable();
    this.updateFormGroup.get('password')?.enable();
    this.updateFormGroup.get('confirmPassword')?.enable();
  }

  disableForm() {
    this.editOn = false;
    this.updateFormGroup.get('name')?.disable();
    this.updateFormGroup.get('email')?.disable();
    this.updateFormGroup.get('password')?.disable();
    this.updateFormGroup.get('confirmPassword')?.disable();
  }

  updateUser() {
    if(this.updateFormGroup.valid) {
      const password = this.updateFormGroup.get('password')?.value;
      const confirmPassword = this.updateFormGroup.get('confirmPassword')?.value;
      if (password == confirmPassword) {
        const userData = {
          id: this.id,
          name: this.updateFormGroup.get('name')?.value,
          email: this.updateFormGroup.get('email')?.value,
          password: password
        };
        this.authService.updateUser(userData).subscribe(() => {
          localStorage.removeItem('loggedUser');
          localStorage.setItem('loggedUser', JSON.stringify(userData));
        }
        )
        this.closeProfileComponent()
      } else {
        console.log('As senhas estão diferentes');
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  deleteUser() {
    this.authService.deleteUser().subscribe(() => {
      localStorage.removeItem('loggedUser');
    })
    this.deleteOn = false;
  }

  cancelDelete() {
    this.deleteOn = false;
  }

  delete() {
    this.deleteOn = true;
  }


togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}

  ngOnInit(): void {
    this.getUser();
    this.builderUpdateFormGroup();
    this.disableForm();
  }
}
