# Pokemon MCP Server

A Model Context Protocol (MCP) server that provides access to Pokemon data through the PokeAPI. This server allows Claude and other MCP-compatible clients to fetch detailed information about Pokemon, including stats, types, moves, and evolution chains.

## Features

- **Pokemon Overview**: Get comprehensive information about any Pokemon including name, types, base stats, and description
- **Move Details**: Fetch detailed information about Pokemon moves including power, PP, type, and damage class
- **Evolution Chains**: Retrieve complete evolution chains for any Pokemon

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation

1. Clone this repository:

```bash
git clone <your-repository-url>
cd pokemon-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

### Development

To run the server in development mode:

```bash
npm run dev
```

### Production

After building, you can run the compiled server:

```bash
node build/index.js
```

## Available Tools

### 1. Get Pokemon Overviews

- **Tool Name**: `get_pokemon_overviews`
- **Description**: Get overview information for multiple Pokemon
- **Parameters**:
  - `pokemonNames`: Array of Pokemon names (e.g., ['pikachu', 'charizard'])
- **Returns**: Name, types, base stats, and description for each Pokemon

### 2. Get Move Detail

- **Tool Name**: `get_move_detail`
- **Description**: Get detailed information about a specific Pokemon move
- **Parameters**:
  - `move`: Move name (e.g., 'hyper beam', 'thunder bolt')
- **Returns**: Move name, power, PP, type, category, and damage class

### 3. Get Evolution Chain

- **Tool Name**: `get_evolution_chain`
- **Description**: Get the complete evolution chain for a Pokemon
- **Parameters**:
  - `pokemonName`: Pokemon name (e.g., 'bulbasaur')
- **Returns**: Complete evolution chain from base form to final evolution

## Connecting to Claude Desktop

To use this MCP server with Claude Desktop, you need to configure it in your Claude Desktop settings.

### Configuration

1. Open Claude Desktop
2. Navigate to Settings → Developer → Edit Config
3. Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "node",
      "args": ["/path/to/your/pokemon-mcp/build/index.js"],
      "env": {}
    }
  }
}
```

**Important**: Replace `/path/to/your/pokemon-mcp/` with the actual absolute path to your project directory.

### Alternative: Using npx (if published)

If you've published this as an npm package, you can use:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "npx",
      "args": ["pokemon-mcp"],
      "env": {}
    }
  }
}
```

### Verification

1. Restart Claude Desktop after updating the configuration
2. Look for the 🔌 icon in the Claude interface, which indicates MCP servers are connected
3. You should see "pokemon" listed as an available MCP server
4. Test the connection by asking Claude about Pokemon information

## Example Usage with Claude

Once connected, you can ask Claude questions like:

- "Can you get information about Pikachu and Charizard?"
- "What are the details of the move Thunder Bolt?"
- "Show me the evolution chain for Squirtle"
- "Compare the stats of Bulbasaur, Charmander, and Squirtle"

## API Data Source

This server fetches data from [PokeAPI](https://pokeapi.co/), a free and open Pokemon API. The server includes caching to improve performance and reduce API calls. For this project specifically, we are using [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2)

## Project Structure

```
pokemon-mcp/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   └── pokemonHelper.ts  # Pokemon API helper functions
├── build/                # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Development Scripts

- `npm run dev` - Run the server in development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for building MCP servers
- `pokedex-promise-v2` - Promise-based PokeAPI wrapper
- `zod` - Schema validation library

## Troubleshooting

### Server Not Connecting

- Ensure the path in your Claude Desktop config is correct and absolute
- Verify that the build directory exists and contains compiled JavaScript
- Check that Node.js is installed and accessible from the command line

### Pokemon Not Found

- Ensure Pokemon names are spelled correctly (case-insensitive)
- Use the official Pokemon names (e.g., "nidoran-f" for female Nidoran)

### Move Not Found

- Move names should use hyphens instead of spaces (e.g., "hyper-beam" instead of "hyper beam")
- The server automatically converts spaces to hyphens, but using the correct format is recommended

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
