import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adress',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adress.component.html',
  styleUrl: './adress.component.scss'
})
export class AdressComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  cepOff: boolean = true;
  adressFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService:  AuthService
  ) {

  }

  closeAdressComponent() {
    this.close.emit();
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

  checkCep() {
    const cep = this.adressFormGroup.get('cep')?.value;
    if (cep != null && cep !== '') {
      this.authService.checkCepService(cep) 
      .subscribe(dados => {
        console.log(dados);
        this.fillInFields(dados);
      }, error => {
        console.error('Erro ao buscar CEP:', error);
      });
    } else {
      console.log("Cep vazio")
    }
  }

  fillInFields(dados: any) {
    this.adressFormGroup.patchValue({
      street: dados?.logradouro,
      neighborhood: dados?.bairro,
      city : dados?.localidade,
      
    })
  }

  disableAddressFields() {
    this.adressFormGroup.get('cep')?.enable();
    this.adressFormGroup.get('street')?.disable();
    this.adressFormGroup.get('neighborhood')?.disable();
    this.adressFormGroup.get('city')?.disable();
  }

  enableAddressFields() {
    this.adressFormGroup.get('cep')?.disable();
    this.adressFormGroup.get('cep')?.setValue(null);
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

  submitAddress() {
    if (this.adressFormGroup.valid) {
      const loggedUser = localStorage.getItem('loggedUser');
      const id = loggedUser ? JSON.parse(loggedUser).id : null;
      const addressData = this.adressFormGroup.getRawValue();
      this.authService.addAddress(id, addressData).subscribe(response => {
        console.log('Endereço cadastrado com sucesso:', response);
        this.closeAdressComponent();
      }, error => {
        console.error('Erro ao cadastrar endereço:', error);
      });
    }
  }

  ngOnInit(): void {
    this.builderAdressFormGroup();
    this.cepOff = true;
    this.disableAddressFields();
  }
}
