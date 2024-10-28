import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [],
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss'
})
export class ExtrasComponent implements OnInit {
 
  @Input() image: any;
  @Input() productTitle!: String;
  @Output() close = new EventEmitter<void>();

  constructor() {

  }

  closeExtrasComponent() {
    this.close.emit();
  }

  ngOnInit(): void {
    
  }
}
