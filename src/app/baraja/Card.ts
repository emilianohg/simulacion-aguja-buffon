export type Type = { name: 'oro', value: 4 }
  | { name: 'copa', value: 3 }
  | { name: 'espadas', value: 2 }
  | { name: 'bastos', value: 1 };

export interface Card {
  type: Type;
  value: number,
  image: string;
  isCover: boolean;
}
