import { Component, Input, OnInit } from '@angular/core'
import { Player } from '../Player'

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() player!: Player;

  constructor() { }

  ngOnInit(): void {
  }

}
