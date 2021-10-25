import { Component, OnInit, ViewChild } from '@angular/core'
import { Card, Type } from './Card'
import { Hand, Player } from './Player'
import { BaseChartDirective, Label } from 'ng2-charts'
import { ChartOptions, ChartType } from 'chart.js'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-baraja',
  templateUrl: './baraja.component.html',
  styleUrls: ['./baraja.component.css']
})
export class BarajaComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  form: FormGroup;
  processing = false;

  cards: Card[];
  cardsOnGame: Hand[];
  players: Player[];
  winnersHands: Hand[];

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

  constructor(
    private fb: FormBuilder,
  ) {

    this.form = this.fb.group({
      totalGames: [10, [Validators.required, Validators.min(1)]],
      duration: [2000, [Validators.required, Validators.min(10)]],
    });

    this.cards = [];
    this.cardsOnGame = [];
    this.players = [];
    this.winnersHands = [];


    this.initPlayers();

    this.pieChartLabels = this.players.map(player => player.name);
    this.pieChartData = this.players.map(_ => 0);

  }

  getCardType (): Type {
    const randomNumber = Math.random();
    if (randomNumber >= 0 && randomNumber < 0.25) {
      return { name: 'oro', value: 4 };
    } else if (randomNumber >= 0.25 && randomNumber < 0.5) {
      return { name: 'copa', value: 3 };
    } else if (randomNumber >= 0.5 && randomNumber < 0.75) {
      return { name: 'espadas', value: 2 };
    } else {
      return { name: 'bastos', value: 1 };
    }
  }

  getCardNumber(): number {
    const randomNumber = Math.random();
    if (randomNumber >= 0 && randomNumber < 0.1) {
      return 13; // AS
    } else if (randomNumber >= 0.1 && randomNumber < 0.2) {
      return 12;
    } else if (randomNumber >= 0.2 && randomNumber < 0.3) {
      return 11;
    } else if (randomNumber >= 0.3 && randomNumber < 0.4) {
      return 10;
    } else if (randomNumber >= 0.4 && randomNumber < 0.5) {
      return 7;
    } else if (randomNumber >= 0.5 && randomNumber < 0.6) {
      return 6;
    } else if (randomNumber >= 0.6 && randomNumber < 0.7) {
      return 5;
    } else if (randomNumber >= 0.7 && randomNumber < 0.8) {
      return 4;
    } else if (randomNumber >= 0.8 && randomNumber < 0.9) {
      return 3;
    } else {
      return 2;
    }
  }

  setCards(player: Player, totalCard: number): void {

    let count = 0;
    while (count < totalCard) {

      const type = this.getCardType();
      const number = this.getCardNumber();
      const card = this.cards.find(card => card.value == number && card.type.value == type.value);

      if (card != undefined) {
        player.cards.push(card);
        const index = this.cards.findIndex(card => card.value == number && card.type.value == type.value);
        this.cards.splice(index, 1);
        count++;
      }

      console.log(this.cards, this.cards.length);
    }

  }

  initPlayers() {
    this.players = [];
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
  }

  play() {

    if (this.form.invalid) {
      return;
    }

    this.currentGame = 1;

    this.initPlayers();

    this.players.forEach((player) => {
      this.pieChartData[player.id] = 0;
    });

    this.chart.chart.update();

    this.processing = true;
    const data = this.form.value;
    this.totalGames = data.totalGames;

    this.chart.chart.update();

    this.game(data.duration);
  }

  game(timeHand = 300) {
    this.init();
    let count = 0;
    const idInterval = setInterval(() => {

      if (count == 10) {
        clearInterval(idInterval);
        this.deliberateWinner();
        console.log(this.currentGame, this.totalGames);
        if (this.currentGame < this.totalGames) {
          this.currentGame++;
          this.game(timeHand);
        } else {
          this.cardsOnGame = [];
          this.winnersHands = [];
          this.processing = false;
        }
        return;
      }

      this.selectHand();
      this.verifyHand(timeHand);

      count++;
    }, timeHand);
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

  verifyHand(delay: number) {
    let maxHand: Hand|null = null;
    this.cardsOnGame.forEach(hand => {
      if (maxHand == null) {
        maxHand = hand;
        return;
      }

      if (hand.card.value > maxHand.card.value) {
        this.flipCard(maxHand.card, delay/2);
        maxHand = hand;
        return;
      }

      if (
        hand.card.value === maxHand.card.value
        && hand.card.type.value > maxHand.card.type.value
      ) {
        this.flipCard(maxHand.card, delay/2);
        maxHand = hand;
        return;
      }

      this.flipCard(hand.card, delay/2);
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

    winner.players.forEach((player) => {
      player.countWin++;
      this.pieChartData[player.id]++;
      this.chart.chart.update();
    });
  }

  flipCard(card: Card, time: number) {
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

    this.players.forEach(player => {
      this.setCards(player, 10);
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
