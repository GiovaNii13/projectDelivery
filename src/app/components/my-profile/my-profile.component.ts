import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdressComponent } from '../adress/adress.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CadastroComponent, ReactiveFormsModule, CommonModule, AdressComponent],
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
  adressFormGroup!: FormGroup;
  fieldDisabled: boolean = true;
  editOn: boolean = false;
  deleteOn: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  logouting = false;
  profileOn: boolean = true;
  adressOn: boolean = false;
  addresses: any[] = [];
  registerAdress: boolean = false;
  adressEdit: boolean = false;
  cepOff: boolean = true;
  selectedAdress: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  closeProfileComponent() {
    this.close.emit();
  }

  closeAdressComponent() {
    this.registerAdress = false;
    this.adressEdit = false;
    this.getAdress();
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
    });
  }

  builderAdressFormGroup() {
    this.adressFormGroup = this.fb.group({
      adressName: [null, Validators.required],
      cep: [null],
      street: [{ value: null, disabled: this.cepOff }, Validators.required],
      number: [null, Validators.required],
      neighborhood: [{ value: null, disabled: this.cepOff }, Validators.required],
      city: [{ value: null, disabled: this.cepOff }, Validators.required],
    });
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
      if (password === confirmPassword) {
        const userData = {
          id: this.id,
          name: this.updateFormGroup.get('name')?.value,
          email: this.updateFormGroup.get('email')?.value,
          password: password
        };
        this.authService.updateUser(userData).subscribe(() => {
          localStorage.removeItem('loggedUser');
          localStorage.setItem('loggedUser', JSON.stringify(userData));
        });
        this.closeProfileComponent();
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
    });
    this.deleteOn = false;
  }

  cancelDelete() {
    this.deleteOn = false;
    this.logouting = false;
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

  toggleAdress() {
    this.adressOn = true;
    this.profileOn = false;
    this.adressEdit = false;
  }

  toggleProfile() {
    this.adressOn = false;
    this.profileOn = true;
    this.adressEdit = false;
  }

  checkCep() {
    const cep = this.adressFormGroup.get('cep')?.value;
    if (cep) {
      this.authService.checkCepService(cep) 
        .subscribe(
          dados => {
            console.log(dados);
            this.fillInFields(dados);
          }, 
          error => {
            console.error('Erro ao buscar CEP:', error);
          }
        );
    } else {
      console.log("Cep vazio");
    }
  }

  fillInFields(dados: any) {
    this.adressFormGroup.patchValue({
      street: dados?.logradouro,
      neighborhood: dados?.bairro,
      city : dados?.localidade,
    });
  }

  disableAddressFields() {
    this.adressFormGroup.get('cep')?.enable();
    this.adressFormGroup.get('street')?.disable();
    this.adressFormGroup.get('neighborhood')?.disable();
    this.adressFormGroup.get('city')?.disable();
  }

  enableAddressFields() {
    this.adressFormGroup.get('cep')?.disable();
    this.adressFormGroup.get('street')?.enable();
    this.adressFormGroup.get('neighborhood')?.enable();
    this.adressFormGroup.get('city')?.enable();
  }

  toggleCepOff(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.cepOff = !checked;
    if (checked) {
      this.enableAddressFields();
    } else {
      this.disableAddressFields();
    }
  }

  selectAdress(adress: any) {
    this.selectedAdress = adress;
    this.adressEdit = true;
    this.adressFormGroup.patchValue({
      adressName: adress.adressName,
      cep: adress.cep,
      street: adress.street,
      number: adress.number,
      neighborhood: adress.neighborhood,
      city: adress.city
    });
    if (!this.cepOff) {
      this.adressFormGroup.get('street')?.enable();
      this.adressFormGroup.get('neighborhood')?.enable();
      this.adressFormGroup.get('city')?.enable();
    }
  }
  

  getAdress() {
    if (this.id) {
      this.authService.getUser(this.id).subscribe(user => {
        if (user && user.addresses) {
          this.addresses = user.addresses;
        }
      });
    }
  }

  editAddress() {
    if (this.adressFormGroup.valid) {
      const loggedUser = localStorage.getItem('loggedUser');
      const userId = loggedUser ? JSON.parse(loggedUser).id : null;
      const addressData = this.adressFormGroup.getRawValue();
      if (this.selectedAdress && this.selectedAdress.id) {
        this.authService.updateAddress(userId, this.selectedAdress.id, addressData)
          .subscribe(response => {
            console.log('Endereço atualizado com sucesso:', response);
            this.closeAdressComponent();
          }, error => {
            console.error('Erro ao atualizar endereço:', error);
          });
      } else {
        this.authService.addAddress(userId, addressData)
          .subscribe(response => {
            console.log('Endereço cadastrado com sucesso:', response);
            this.closeAdressComponent();
          }, error => {
            console.error('Erro ao cadastrar endereço:', error);
          });
      }
    }
  }

  deleteAddress(addressId: string) {
    const loggedUser = localStorage.getItem('loggedUser');
    const userId = loggedUser ? JSON.parse(loggedUser).id : null;
  
    if (userId) {
      this.authService.deleteAddress(userId, addressId)
        .subscribe(response => {
          this.getAdress(); 
          this.closeAdressComponent();
        });
    }
  }

  showLogoutModal() {
    this.logouting = true;
    console.log(this.logouting);
  }
  
  ngOnInit(): void {
    this.getUser();
    this.builderUpdateFormGroup();
    this.builderAdressFormGroup();
    this.disableForm();
    this.getAdress();
    const usuarioSalvo = localStorage.getItem('loggedUser');
  }
}
