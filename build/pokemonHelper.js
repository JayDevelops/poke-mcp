import Pokedex from "pokedex-promise-v2";
const P = new Pokedex();
export async function getPokemonOverview(name) {
    try {
        const data = await P.getPokemonByName(name);
        const species = await P.getPokemonSpeciesByName(name);
        const pokemonOverview = {
            properties: {
                name: data.name,
                types: data.types.map((t) => t.type.name),
                stats: data.stats.map((s) => ({
                    stat: s.stat.name,
                    value: s.base_stat,
                })),
                description: species.flavor_text_entries?.find((f) => f.language.name === "en")?.flavor_text,
            },
        };
        return pokemonOverview;
    }
    catch (error) {
        console.error("Error making pokemon overview request:", error);
        return null;
    }
}
//  Helper to format pokemon overview for claude response, returns a formatted string
export function formatPokemonOverview(pokemonOverview) {
    const props = pokemonOverview.properties;
    const nameLine = `Name: ${props.name || "Unknown"}`;
    const typesLine = `Types: ${props.types?.join(", ") || "Unknown"}`;
    const statsLine = `Stats: ${props.stats
        ?.map((s) => `${s.stat || "Unknown"}: ${s.value ?? "Unknown"}`)
        .join(", ") || "Unknown"}`;
    const descriptionLine = `Description: ${props.description || "Unknown"}`;
    return [nameLine, typesLine, statsLine, descriptionLine].join("\n");
}
export async function getMoveDetails(moveName) {
    try {
        const [move, category, dmgClass] = await Promise.all([
            P.getMoveByName(moveName),
            P.getMoveCategoryByName(moveName),
            P.getMoveDamageClassByName(moveName),
        ]);
        const moveDetail = {
            properties: {
                move: move,
                category: category.name,
                damageClass: dmgClass.name,
            },
        };
        return moveDetail;
    }
    catch (error) {
        console.error("Error making move detail request:", error);
        return null;
    }
}
export async function getEvolutionChain(name) {
    try {
        const species = await P.getPokemonSpeciesByName(name);
        const evoUrl = species.evolution_chain.url;
        const evoId = evoUrl.split("/").filter(Boolean).pop();
        const evolutionChain = await P.getEvolutionChainById(Number(evoId));
        // Flatten the evolution chain into an array of names
        const chain = [];
        let current = evolutionChain.chain;
        while (current) {
            chain.push(current.species.name);
            current = current.evolves_to?.[0];
        }
        return { properties: { chain } };
    }
    catch (error) {
        console.error("Error getting evolution chain  request:", error);
        return null;
    }
}
export function formatEvolutionChain(evolution) {
    const chain = evolution.properties.chain;
    if (!chain || chain.length === 0) {
        return "No evolution data found.";
    }
    return `Evolution Chain:\n${chain.join(" → ")}`;
}
