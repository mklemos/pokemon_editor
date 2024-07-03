import PokemonEditor from './components/PokemonEditor';

function App() {
  return (
    <div className="App">
      <h1><span className="pokemon_title_monk">Poké</span><span className="pokemon_title_solid">Edit</span></h1>
      <PokemonEditor />
      <div className="editor-note">
        <p>Note: Use the @ symbol to mention and insert Pokémon characters!</p>
      </div>
    </div>
  );
}

export default App;