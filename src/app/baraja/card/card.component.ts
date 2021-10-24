import { Component, Input, OnInit } from '@angular/core'
import { Card } from '../Card'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card!: Card;
  @Input() isVertical: boolean = false;

  @Input() height: number = 100;
  @Input() width: number = 67;

  constructor() {}

  ngOnInit(): void {
  }

}
