import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  cadastroFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  cadastroFormBuilder() {
    this.cadastroFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(130)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      birthDate: [null, [Validators.required]],
      endereco: this.fb.group({
        street: [null, [Validators.required]],
        number: [null, [Validators.required]],
        neighborhood: [null, [Validators.required]]
      })
    })
  }

  ngOnInit(): void {
      
  }
}
