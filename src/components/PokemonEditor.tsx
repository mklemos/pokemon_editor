import { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { PokemonPlugin } from '../plugins/PokemonPlugin';
import { PokemonNode } from '../nodes/PokemonNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import Toolbar from './toolbar';
import CustomErrorBoundary from './customErrorBoundary';
import '../styles/PokemonEditor.css';

type Pokemon = {
  name: string;
  url: string;
  sprites: {
    front_default: string;
  };
};

const theme = {};

function PokemonEditor() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => {
        Promise.all(data.results.map((p: { url: string }) => fetch(p.url).then(res => res.json())))
          .then(pokemonDetails => setPokemon(pokemonDetails));
      });
  }, []);

  const initialConfig = {
    namespace: 'PokemonEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [PokemonNode, HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="ContentEditable__root" />}
          placeholder={<div className="editor-placeholder">Start your Poké story...</div>}
          ErrorBoundary={(props) => <CustomErrorBoundary {...props} onError={initialConfig.onError} />}
        />
        <HistoryPlugin />
        <ListPlugin />
        <PokemonPlugin pokemon={pokemon} />
      </LexicalComposer>
    </div>
  );
}

export default PokemonEditor;
