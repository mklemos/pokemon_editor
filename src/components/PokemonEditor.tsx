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
import '../styles/PokemonEditor.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

type Pokemon = {
  name: string;
  url: string;
  sprites: {
    front_default: string;
  };
};

type SavedNote = {
  id: string;
  content: string;
  timestamp: number;
};

const theme = {};

function SaveButton() {
  const [editor] = useLexicalComposerContext();
  const [notes, setNotes] = useState<SavedNote[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('pokemonEditorNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveContent = () => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      const newNote: SavedNote = {
        id: Date.now().toString(),
        content: JSON.stringify(json),
        timestamp: Date.now(),
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('pokemonEditorNotes', JSON.stringify(updatedNotes));
      alert('Note saved!');
    });
  };

  const loadNote = (noteContent: string) => {
    editor.update(() => {
      const parsedState = editor.parseEditorState(noteContent);
      editor.setEditorState(parsedState);
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('pokemonEditorNotes', JSON.stringify(updatedNotes));
    alert('Note deleted!');
  };

  return (
    <>
      <button onClick={saveContent}>Save Note</button>
      <div className="saved-notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <p>Note saved at {new Date(note.timestamp).toLocaleString()}</p>
            <button onClick={() => loadNote(note.content)}>Load</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

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
    <div className="pokemon-editor-container">
      <div className="editor-container">
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar />
          <RichTextPlugin
            contentEditable={<ContentEditable className="ContentEditable__root" />}
            placeholder={<div className="editor-placeholder">Start your Poké story...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <PokemonPlugin pokemon={pokemon} />
          <SaveButton />
        </LexicalComposer>
      </div>
    </div>
  );
}

export default PokemonEditor;
