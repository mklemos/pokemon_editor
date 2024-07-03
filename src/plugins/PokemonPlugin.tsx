import { useState, useEffect, useCallback, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $isTextNode, $createTextNode } from 'lexical';
import { Pokemon } from '../nodes/types';
import { $createPokemonNode } from '../nodes/PokemonNode';

export function PokemonPlugin({ pokemon }: { pokemon: Pokemon[] }) {
  const [editor] = useLexicalComposerContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [matchingPokemon, setMatchingPokemon] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<{ [key: string]: any }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateDropdownPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editor.getRootElement()?.getBoundingClientRect();

      if (editorRect) {
        const lineHeight = parseInt(window.getComputedStyle(range.startContainer.parentElement!).lineHeight);
        let left = rect.left - editorRect.left;
        const dropdownWidth = dropdownRef.current?.offsetWidth || 0;
        
        // Adjust left position to keep the dropdown within the editor bounds
        if (left + dropdownWidth > editorRect.width) {
          left = editorRect.width - dropdownWidth;
        }
        if (left < 0) {
          left = 0;
        }
        
        setDropdownPosition({
          top: rect.bottom - editorRect.top + lineHeight,
          left: left
        });
      }
    }
  }, [editor]);

  const insertPokemon = useCallback(
    (selectedPokemon: Pokemon) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          if ($isTextNode(anchorNode)) {
            const textContent = anchorNode.getTextContent();
            const lastAtIndex = textContent.lastIndexOf('@');
            if (lastAtIndex !== -1) {
              anchorNode.spliceText(lastAtIndex, textContent.length - lastAtIndex, '');
            }
          }
          const details = pokemonDetails[selectedPokemon.name];
          const pokemonNode = $createPokemonNode(
            selectedPokemon.name,
            selectedPokemon.sprites.front_default,
            details.height,
            details.weight,
            details.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name)
          );
          selection.insertNodes([pokemonNode, $createTextNode(' ')]);
        }
        setShowDropdown(false);
        setSearchTerm('');
      });
    },
    [editor, pokemonDetails]
  );

  useEffect(() => {
    const listener = editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          if ($isTextNode(node)) {
            const textContent = node.getTextContent();
            const cursorOffset = selection.anchor.offset;
            const textBeforeCursor = textContent.slice(0, cursorOffset);
            const words = textBeforeCursor.split(/\s+/);
            const lastWord = words[words.length - 1];

            if (lastWord.startsWith('@')) {
              setSearchTerm(lastWord.slice(1));
              setShowDropdown(true);
              updateDropdownPosition();
            } else {
              setShowDropdown(false);
            }
          }
        }
      });
    });
    return () => listener();
  }, [editor, updateDropdownPosition]);

  useEffect(() => {
    if (searchTerm) {
      const matches = pokemon.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchingPokemon(matches.slice(0, 5));
    } else {
      setMatchingPokemon([]);
    }
  }, [searchTerm, pokemon]);

  const fetchPokemonDetails = useCallback(async (name: string, url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPokemonDetails(prevDetails => ({ ...prevDetails, [name]: data }));
    } catch (error) {
      console.error(`Error fetching Pokémon details: ${error}`);
    }
  }, []);

  useEffect(() => {
    matchingPokemon.forEach(p => {
      if (!pokemonDetails[p.name]) {
        fetchPokemonDetails(p.name, `https://pokeapi.co/api/v2/pokemon/${p.name}`);
      }
    });
  }, [matchingPokemon, pokemonDetails, fetchPokemonDetails]);

  return showDropdown ? (
    <div
      className="pokemon-dropdown"
      style={{
        position: 'absolute',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        zIndex: 1000
      }}
      ref={dropdownRef}
    >
      {matchingPokemon.map((p) => (
        <div
          key={p.name}
          className="pokemon-option"
          onClick={() => insertPokemon(p)}
        >
          <img src={p.sprites.front_default} alt={p.name} width="30" height="30" />
          <span>{p.name}</span>
        </div>
      ))}
    </div>
  ) : null;
}