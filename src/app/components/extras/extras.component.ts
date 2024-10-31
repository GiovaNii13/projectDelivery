import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss'
})
export class ExtrasComponent implements OnInit {
 
  @Input() image: any;
  @Input() productTitle!: string;
  @Input() productPrice!:number;
  @Output() close = new EventEmitter<void>();
  specialAdds!: any[];
  freeAdds!: any[];

  constructor(
    private authService: AuthService
  ) {

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

  ngOnInit(): void {
    this.getFreeAdds();
    this.getSpecialAdds();
  }
}
