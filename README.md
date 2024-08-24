## PokéEdit: A Pokémon-Themed Rich Text Editor

PokéEdit is a fun and powerful text editor built with React, TypeScript, and the Lexical editor library. It's designed for Pokémon enthusiasts who want to create engaging stories, articles, or even just fun notes, all while featuring their favorite Pokémon. 

### Features:

**Interactive Pokémon Integration:**

* **Seamless Insertion:**  Add Pokémon to your text by simply typing "@" followed by their name.  A dropdown menu will automatically suggest matching Pokémon from the PokéAPI, making it easy to find the right companion for your story.
* **Dynamic Details:** Hover over a Pokémon in your text to view their details, including height, weight, types, and even a visual representation of their sprite. This adds a layer of interactivity and visual appeal.

**Rich Text Editing Tools:**

* **Familiar Formatting:**  Utilize standard text formatting options like bold, italic, headings (H1 and H2), quotes, and lists (both numbered and bulleted) to structure and enhance your writing.
* **Customizable Toolbar:** Easily access formatting options with a dedicated toolbar, providing a streamlined and user-friendly experience.

**Built for Pokémon Fans:**

* **Pokémon-Themed Design:** The editor features a visually appealing design that reflects the Pokémon world, making it fun and engaging to use.
* **Open-Source:**  PokéEdit is open-source, allowing anyone to contribute and enhance its features.

### Technical Overview:

* **React:** The front-end framework that powers PokéEdit, enabling a dynamic and responsive user interface.
* **TypeScript:** The programming language used to ensure type safety and code clarity.
* **Lexical Editor:** A powerful and flexible library for creating rich text editors, providing the foundation for PokéEdit's editing functionalities.
* **PokéAPI:** An open-source API that provides comprehensive data about Pokémon, including names, sprites, and other details.

### Getting Started:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mklemos/pokemon_editor.git
   ```

2. **Install dependencies:**
   ```bash
   cd pokemon-editor
   npm install 
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) to view the application in your browser.

### Development Notes:

* The project fetches Pokémon data from the [PokéAPI](https://pokeapi.co/) using the `fetch` API.
* Lexical editor handles core editing functionalities. Custom nodes and plugins are developed to implement Pokémon-specific features.

### Contributing:

Contributions are welcomed!  Here are some ways you can contribute:

* **Bug fixes:**  Report or fix any issues you find.
* **New features:**  Enhance the editor with new Pokémon-related features or functionalities.
* **Documentation improvements:**  Enhance the README and documentation for the project.
* **Design improvements:**  Suggest ways to improve the visual appeal or user experience of the editor.

### License:

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Let's Create Together!

Start writing your Pokémon adventures today with PokéEdit!  We hope you enjoy using it as much as we enjoyed building it.  Join us on this journey of creating a fun and engaging Pokémon-themed editor.

