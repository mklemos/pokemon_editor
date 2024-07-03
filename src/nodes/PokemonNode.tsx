import { DecoratorNode, EditorConfig, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import React, { useState } from 'react';

export type SerializedPokemonNode = Spread<
  {
    name: string;
    sprite: string;
    height: number;
    weight: number;
    types: string[];
  },
  SerializedLexicalNode
>;

export class PokemonNode extends DecoratorNode<React.ReactNode> {
  __name: string;
  __sprite: string;
  __height: number;
  __weight: number;
  __types: string[];

  static getType(): string {
    return 'pokemon';
  }

  static clone(node: PokemonNode): PokemonNode {
    return new PokemonNode(node.__name, node.__sprite, node.__height, node.__weight, node.__types, node.__key);
  }

  constructor(name: string, sprite: string, height: number, weight: number, types: string[], key?: NodeKey) {
    super(key);
    this.__name = name;
    this.__sprite = sprite;
    this.__height = height;
    this.__weight = weight;
    this.__types = types;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return <PokemonComponent name={this.__name} sprite={this.__sprite} height={this.__height} weight={this.__weight} types={this.__types} />;
  }

  exportJSON(): SerializedPokemonNode {
    return {
      type: 'pokemon',
      version: 1,
      name: this.__name,
      sprite: this.__sprite,
      height: this.__height,
      weight: this.__weight,
      types: this.__types,
    };
  }

  static importJSON(serializedNode: SerializedPokemonNode): PokemonNode {
    const { name, sprite, height, weight, types } = serializedNode;
    return $createPokemonNode(name, sprite, height, weight, types);
  }
}

export function $createPokemonNode(name: string, sprite: string, height: number, weight: number, types: string[]): PokemonNode {
  return new PokemonNode(name, sprite, height, weight, types);
}

function PokemonComponent({ name, sprite, height, weight, types }: { name: string; sprite: string; height: number; weight: number; types: string[] }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleMouseEnter = () => {
    setShowDetails(true);
  };

  const handleMouseLeave = () => {
    setShowDetails(false);
  };

  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <span className="pokemon-pill" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img src={sprite} alt={capitalizedName} />
      {capitalizedName}
      {showDetails && (
        <div className="pokemon-details">
          <p>Height: {height}</p>
          <p>Weight: {weight}</p>
          <p>Types: {types.join(', ')}</p>
        </div>
      )}
    </span>
  );
}