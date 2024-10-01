import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-adress',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './adress.component.html',
  styleUrl: './adress.component.scss'
})
export class AdressComponent implements OnInit {

  cepOff: boolean = true;
  adressFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService:  AuthService
  ) {

  }

  builderAdressFormGroup() {
    this.adressFormGroup = this.fb.group({
      cep: [null],
      street: [null, Validators.required],
      number: [null, Validators.required],
      neighborhood: [null, Validators.required],
      city: [null, Validators.required],
    })
  }

  consultaCEP() {
    const cep = this.adressFormGroup.get('cep')?.value;
    if (cep != null && cep !== '') {
      this.authService.consultaCep(cep)
      .subscribe(dados => {
        console.log(dados); // Para ver o que está retornando
        this.populaDadosForm(dados);
      }, error => {
        console.error('Erro ao buscar CEP:', error);
      });
    }
  }

  populaDadosForm(dados: any) {
    this.adressFormGroup.patchValue({
      street: dados?.logradouro,
      neighborhood: dados?.bairro,
      city : dados?.localidade,
      
    })
  }

  ngOnInit(): void {
    this.builderAdressFormGroup();
  }
}
