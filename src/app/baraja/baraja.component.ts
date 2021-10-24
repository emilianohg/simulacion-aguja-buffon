import { Component, OnInit, ViewChild } from '@angular/core'
import { Card, Type } from './Card'
import { Hand, Player } from './Player'
import { BaseChartDirective, Label } from 'ng2-charts'
import { ChartOptions, ChartType } from 'chart.js'

@Component({
  selector: 'app-baraja',
  templateUrl: './baraja.component.html',
  styleUrls: ['./baraja.component.css']
})
export class BarajaComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  cards: Card[];
  cardsOnGame: Hand[];
  players: Player[];
  winnersHands: Hand[];

  timeHand = 1000;
  totalGames = 10;
  currentGame = 1;

  showPlayersCards = true;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
      position: 'top',
    },
  };

  colors = ['#f7941e60', '#8fd6e760', '#744a2560', '#694b7460'];

  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: this.colors,
    },
  ];

  constructor() {

    this.cards = [];
    this.cardsOnGame = [];
    this.players = [];
    this.winnersHands = [];


    for (let i = 0; i < 4; i++) {
      this.players.push({
        id: i,
        name: `Player ${ i + 1}`,
        countWin: 0,
        cards: [],
        image: `assets/users/user-${ i + 1 }.png`,
        color: this.colors[i],
      });
    }

    this.pieChartLabels = this.players.map(player => player.name);
    this.pieChartData = this.players.map(_ => 0);

    //this.init();
    //this.selectHand();

    this.game();

  }

  game() {
    this.init();
    let count = 0;
    const idInterval = setInterval(() => {

      if (count == 10) {
        clearInterval(idInterval);
        this.deliberateWinner();
        console.log(this.currentGame, this.totalGames);
        if (this.currentGame < this.totalGames) {
          this.currentGame++;
          this.game();
        } else {
          this.cardsOnGame = [];
          this.winnersHands = [];
        }
        return;
      }

      this.selectHand();
      this.verifyHand();

      count++;
    }, this.timeHand);
  }

  selectHand() {
    this.cardsOnGame = [];
    this.players.forEach(player => {
      const card = player.cards.pop()!;
      //card.isCover = true;
      this.cardsOnGame.push({
        player: player,
        card: card,
      });
    });
  }

  verifyHand() {
    let maxHand: Hand|null = null;
    this.cardsOnGame.forEach(hand => {
      if (maxHand == null) {
        maxHand = hand;
        return;
      }

      if (hand.card.value > maxHand.card.value) {
        this.flipCard(maxHand.card);
        maxHand = hand;
        return;
      }

      if (
        hand.card.value === maxHand.card.value
        && hand.card.type.value > maxHand.card.type.value
      ) {
        this.flipCard(maxHand.card);
        maxHand = hand;
        return;
      }

      this.flipCard(hand.card);
    });

    this.winnersHands.push(maxHand!);

  }

  deliberateWinner() {

    let winner : {players: Player[], hands: number} = {
      players: [],
      hands: 0,
    };

    this.players.forEach(player => {

      const totalHands = this.winnersHands.filter(hand => hand.player.name == player.name).length;

      if (winner.players.length == 0) {
        winner.players.push(player);
        winner.hands = totalHands;
        return;
      }

      if (totalHands > winner.hands) {
        winner.players = [player];
        winner.hands = totalHands;
        return;
      }

      if (totalHands == winner.hands) {
        winner.players.push(player);
        winner.hands = totalHands;
      }

    });

    winner.players.forEach((player, i) => {
      player.countWin++;
      this.pieChartData[player.id]++;
      this.chart.chart.update();
    });
  }

  flipCard(card: Card, time = this.timeHand / 2) {
    setTimeout(() => {
      card.isCover = !card.isCover;
    }, time);
  }

  ngOnInit(): void {
  }

  init() {
    this.cards = [];
    this.cardsOnGame = [];
    this.winnersHands = [];

    const types: Type[] = [
      { name: 'oro', value: 4 },
      { name: 'copa', value: 3 },
      { name: 'espadas', value: 2 },
      { name: 'bastos', value: 1 },
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 12; j++) {

        if (j == 8 || j == 9) {
          continue;
        }

        const card: Card = {
          type: types[i],
          value: j == 1 ? 13 : j,
          image: `assets/baraja/carta-${ j }-${ types[i].name }.png`,
          isCover: !this.showPlayersCards,
        };
        this.cards.push(card);
      }
    }

    this.shuffleArray(this.cards);

    this.players.forEach((player, i) => {
      player.cards = this.cards.slice(i * 10, (i + 1) * 10);
    });

  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  get sumWinners() {
    return this.players.map(player => player.countWin).reduce((current, sum) => sum += current);
  }

}
