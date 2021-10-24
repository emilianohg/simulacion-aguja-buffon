import { Card } from './Card'

export interface Player {
  id: number;
  name: string;
  countWin: number;
  cards: Card[];
  image: string;
  color: string;
}

export interface Hand {
  player: Player,
  card: Card,
}
