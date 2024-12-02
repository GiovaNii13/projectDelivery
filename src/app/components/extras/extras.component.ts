import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss',
  providers: [MessageService]
})
export class ExtrasComponent implements OnInit {
 
  @Input() image: any;
  @Input() productTitle!: string;
  @Input() productPrice!:number;
  @Output() close = new EventEmitter<void>();
  @Output() orderAdded = new EventEmitter<void>();
  orders: any[] = [];
  specialAdds!: any[];
  freeAdds!: any[];
  orderFormGroup!: FormGroup;
  productSize!: number;
  chooseFreeAddsCount: { [key: string]: { title: string, count: number } } = {};
  chooseSpecialAddsCount: { [key: string]: { title: string, price: number, count: number } } = {};
  blockAdd: boolean = false;
  blockpecialAdds: boolean = false;
  showDecrement: boolean = false;
  textThreeAdds = 'Escolha 3 Adicionais';
  textFiveAdds = 'Escolha 5 Adicionais'
  sizeObservation: number = 0;
  totalPrice!: number;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {

  }

  showToastMessage(type: any, title: any, message: any) {
    this.messageService.add({ severity: type, summary: title, detail: message });
  }

  builderOrderFormGroup() {
    this.orderFormGroup = this.fb.group({
      productImage: [this.image, Validators.required],
      freeAdds: [this.chooseFreeAddsCount, Validators.required],
      specialAdds: this.fb.array([this.chooseSpecialAddsCount]),
      observation: [null],
      price: [this.productPrice, Validators.required]
    })
  }

  getProductSize() {
    switch(this.productTitle){
      case "AÇAÍ - 300ML":
        this.productSize = 300;
        break
      case "AÇAÍ - 500ML":
        this.productSize = 500;
        break
      case "AÇAÍ - 700ML":
        this.productSize = 700;
        break
      case "AÇAÍ - 1000ML":
        this.productSize = 1000;
        break
    }
  }

  minItemsValidator() {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const requiredLength = this.productSize === 1000 ? 5 : 3;
      return formArray.value.length >= requiredLength ? null : { minItems: true };
    };
  }

  async getFreeAdds() {
    await this.authService.getFreeAdss().subscribe(FreeAdds => {
      this.freeAdds = FreeAdds
    }
    );
    console.log(this.freeAdds);
  }

  async getSpecialAdds() {
    await this.authService.getSpecialAdds().subscribe(SpecialAdds => {
      this.specialAdds = SpecialAdds
    }
    );
    console.log(this.specialAdds);
  }

  closeExtrasComponent() {
    this.close.emit();
  }

  incrementFreeAdds(item: any) {
    const itemId = item.id;
    if (this.chooseFreeAddsCount[itemId]) {
      this.chooseFreeAddsCount[itemId].count++;
    } else {
      this.chooseFreeAddsCount[itemId] = { title: item.title, count: 1 };
    }
    const totalAdds = Object.values(this.chooseFreeAddsCount).reduce((sum, item: any) => sum + item.count, 0);
    if (this.productSize !== 1000) {
      this.blockAdd = totalAdds >= 3;
    } else {
      this.blockAdd = totalAdds >= 5;
    }
  }
  
  decrementFreeAdds(item: any) {
    const itemId = item.id;
    if (this.chooseFreeAddsCount[itemId]) {
      this.chooseFreeAddsCount[itemId].count--;
      if (this.chooseFreeAddsCount[itemId].count === 0) {
        delete this.chooseFreeAddsCount[itemId];
      }
    }
    const totalAdds = Object.values(this.chooseFreeAddsCount).reduce((sum, item: any) => sum + item.count, 0);
    if (this.productSize !== 1000) {
      this.blockAdd = totalAdds >= 3;
    } else {
      this.blockAdd = totalAdds >= 5; 
    }
  }

  incrementSpecialAdds(item: any) {
    const itemId = item.id;
    if (this.chooseSpecialAddsCount[itemId]) {
      this.chooseSpecialAddsCount[itemId].count++;
    } else {
      this.chooseSpecialAddsCount[itemId] = { title: item.title, price: item.price, count: 1 };
    }
    const totalAdds = Object.values(this.chooseSpecialAddsCount).reduce((sum, item) => sum + item.count, 0);
    this.blockpecialAdds = totalAdds >= 2;
    this.updateTotalPrice();
    console.log(this.chooseSpecialAddsCount);
  }
  
  decrementSpecialAdds(item: any) {
    const itemId = item.id;
    if (this.chooseSpecialAddsCount[itemId]) {
      this.chooseSpecialAddsCount[itemId].count--;
      if (this.chooseSpecialAddsCount[itemId].count === 0) {
        delete this.chooseSpecialAddsCount[itemId];
      }
    }
    const totalAdds = Object.values(this.chooseSpecialAddsCount).reduce((sum, item) => sum + item.count, 0);
    this.blockpecialAdds = totalAdds >= 2;
    this.updateTotalPrice();
    console.log(this.chooseSpecialAddsCount);
  }
  
  updateTotalPrice() {
    let total = this.productPrice;
    Object.values(this.chooseSpecialAddsCount).forEach((item) => {
      total += item.price * item.count;
    });
    this.totalPrice = total;
  }
  

  sendOrder() {
    let requiredFreeAdds = 0;
    if (this.productTitle === 'AÇAÍ - 1000ML') {
      requiredFreeAdds = 5;
    } else {
      requiredFreeAdds = 3;
    }
    const totalFreeAdds = Object.values(this.chooseFreeAddsCount).reduce((total, add) => {
      return total + (add.count || 0);
    }, 0);
    if (totalFreeAdds < requiredFreeAdds) {
      const type = 'error';
      const title = 'Erro';
      const message = `Escolha os ${requiredFreeAdds} adicionais grátis`;
      this.showToastMessage(type, title, message);
      return;
    }
    let totalPrice = this.productPrice;
    Object.values(this.chooseSpecialAddsCount).forEach((item) => {
      totalPrice += item.price * item.count;
    });
    const order = {
      productImage: this.image,
      productTitle: this.productTitle,
      freeAdds: this.chooseFreeAddsCount,
      specialAdds: this.chooseSpecialAddsCount,
      observation: this.orderFormGroup.get('observation')?.value,
      price: totalPrice,
    };
    if (this.orderFormGroup.valid) {
      this.authService.addOrder(order);
      this.orderAdded.emit();
      console.log(order);
    }
    this.closeExtrasComponent();
  }

  attCharacters() {
    const textObservation = this.orderFormGroup.get('observation')?.value;
    this.sizeObservation = textObservation.length
  }

  ngOnInit(): void {
    this.getFreeAdds();
    this.getSpecialAdds();
    this.getProductSize();
    this.builderOrderFormGroup();
    this.orders = this.authService.getOrders();
    this.totalPrice = this.productPrice;
    console.log(this.orders, 'pedidos enviados para o carrinho');
  }
}
