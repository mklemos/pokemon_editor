export type Pokemon = {
  name: string;
  url: string;
  sprites: {
    front_default: string;
  };
};

export type PokemonDetail = {
  height: number;
  weight: number;
  types: { type: { name: string } }[];
};
