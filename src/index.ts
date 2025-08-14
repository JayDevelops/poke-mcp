import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  formatPokemonOverview,
  getPokemonOverview,
  PokemonOverview,
} from "./pokemonHelper.js";

// Create server instance
const server = new McpServer({
  name: "pokemon",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// getting overviews for multiple pokemon
server.tool(
  "get_pokemon_overviews",
  "Get pokemon overview for multiple pokemons.",
  {
    pokemonNames: z
      .array(z.string().min(2))
      .describe("Array of Pokémon names, e.g. ['ditto', 'pikachu']"),
  },
  async ({ pokemonNames }) => {
    const overviews = await Promise.all(
      pokemonNames.map(async (name) => {
        const overview = await getPokemonOverview(name);
        if (!overview) return `${name}: Failed to retrieve`;
        return formatPokemonOverview(overview);
      })
    );

    if (overviews.length < 0) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve pokemon overview for all pokemons.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: overviews.join("\n\n"),
        },
      ],
    };
  }
);

// getting move detail for specific move
// server.tool("get_move_detail", "Get move detail for specific move", {
//   move: z
//     .string()
//     .min(2)
//     .describe(
//       "Get move detail for specific move (e.g. 'hyper beam', 'razor leaf'"
//     ),
// },
// async ({move}) => {

// }
// );

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pokemon MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
