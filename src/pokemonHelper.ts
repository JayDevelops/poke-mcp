import Pokedex from "pokedex-promise-v2";

const P = new Pokedex();

export interface PokemonOverview {
  properties: {
    name?: string;
    types?: string[];
    stats?: {
      stat: string | undefined | null;
      value: number | null;
    }[];
    description?: string | undefined;
  };
}

export async function getPokemonOverview(
  name: string
): Promise<PokemonOverview | null> {
  try {
    const data = await P.getPokemonByName(name);
    const species = await P.getPokemonSpeciesByName(name);

    const pokemonOverview: PokemonOverview = {
      properties: {
        name: data.name,
        types: data.types.map((t) => t.type.name),
        stats: data.stats.map((s) => ({
          stat: s.stat.name,
          value: s.base_stat,
        })),
        description: species.flavor_text_entries?.find(
          (f) => f.language.name === "en"
        )?.flavor_text,
      },
    };
    return pokemonOverview;
  } catch (error) {
    console.error("Error making pokemon overview request:", error);
    return null;
  }
}

//  Helper to format pokemon overview for claude response, returns a formatted string
export function formatPokemonOverview(
  pokemonOverview: PokemonOverview
): string {
  const props = pokemonOverview.properties;

  const nameLine = `Name: ${props.name || "Unknown"}`;
  const typesLine = `Types: ${props.types?.join(", ") || "Unknown"}`;
  const statsLine = `Stats: ${
    props.stats
      ?.map((s) => `${s.stat || "Unknown"}: ${s.value ?? "Unknown"}`)
      .join(", ") || "Unknown"
  }`;
  const descriptionLine = `Description: ${props.description || "Unknown"}`;

  return [nameLine, typesLine, statsLine, descriptionLine].join("\n");
}

export interface MoveDetail {
  properties: {
    name?: string | null | undefined;
    pp?: Number | null;
    type?: string | null | undefined;
    category?: string;
    power?: number | null | undefined;
    damageClass?: string;
  };
}

//  Helper to normalize with hypens for pokedex api. example 'hyper beam' must be turned into 'hyper-beam'
function normalizeMoveName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export async function getMoveDetails(
  moveName: string
): Promise<MoveDetail | null> {
  try {
    const normalizedMoveName = normalizeMoveName(moveName);
    console.log(normalizeMoveName);

    const [move, category, dmgClass] = await Promise.all([
      P.getMoveByName(normalizedMoveName),
      P.getMoveCategoryByName(normalizedMoveName),
      P.getMoveDamageClassByName(normalizedMoveName),
    ]);

    const moveDetail: MoveDetail = {
      properties: {
        name: move.name,
        pp: move.pp,
        type: move.type.name,
        power: move.power,
        category: category.name,
        damageClass: dmgClass.name,
      },
    };
    return moveDetail;
  } catch (error) {
    console.error("Error making move detail request:", error);
    return null;
  }
}

export function formatMoveDetail(move: MoveDetail): string {
  const props = move.properties;

  const moveName = `Move Name: ${props.name || "Unknown"}`;
  const power = `Power: ${props.power || "Unkown"}`;
  const pp = `Base PP: ${props.pp || "Unknown"}`;
  const type = `Type: ${props.type || "Unkownn"}`;
  const moveCategory = `Category: ${props.category || "Unknown"}`;
  const damageClass = `Damage Class: ${props.damageClass || "Unknown"}`;

  return [moveName, power, pp, type, moveCategory, damageClass].join("\n");
}

interface EvolutionChain {
  properties: {
    chain?: string[];
  };
}

export async function getEvolutionChain(
  name: string
): Promise<EvolutionChain | null> {
  try {
    const species = await P.getPokemonSpeciesByName(name);
    const evoUrl = species.evolution_chain.url;
    const evoId = evoUrl.split("/").filter(Boolean).pop();
    const evolutionChain = await P.getEvolutionChainById(Number(evoId));

    // Flatten the evolution chain into an array of names
    const chain: string[] = [];
    let current = evolutionChain.chain;

    while (current) {
      chain.push(current.species.name);
      current = current.evolves_to?.[0];
    }

    return { properties: { chain } };
  } catch (error) {
    console.error("Error getting evolution chain  request:", error);
    return null;
  }
}

export function formatEvolutionChain(evolution: EvolutionChain): string {
  const chain = evolution.properties.chain;

  if (!chain || chain.length === 0) {
    return "No evolution data found.";
  }

  return `Evolution Chain:\n${chain.join(" → ")}`;
}
