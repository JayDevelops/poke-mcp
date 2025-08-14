import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { formatPokemonOverview, getPokemonOverview, } from "./pokemonHelper.js";
// const NWS_API_BASE = "https://api.weather.gov";
// const USER_AGENT = "weather-app/1.0";
// Create server instance
const server = new McpServer({
    name: "pokemon",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// get pokemon overview tool
server.tool("get_pokemon_overviews", "Get pokemon overview for multiple pokemons.", {
    pokemonNames: z
        .array(z.string().min(2))
        .describe("Array of Pokémon names, e.g. ['ditto', 'pikachu']"),
}, async ({ pokemonNames }) => {
    const overviews = await Promise.all(pokemonNames.map(async (name) => {
        const overview = await getPokemonOverview(name);
        if (!overview)
            return `${name}: Failed to retrieve`;
        return formatPokemonOverview(overview);
    }));
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
});
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
