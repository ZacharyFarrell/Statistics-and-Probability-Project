const fs = require('fs');

const generations = {};
const data = [];

async function checkIfLegendary(pokemon) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
  const json = await res.json();
  return json.is_legendary;
}

async function checkIfMythical(pokemon) {
  // making the same request twice hurts lol. I would come back to clean up, but I know I probably won't.
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
  const json = await res.json();
  return json.is_mythical;
}

async function addPokemonData(chain) {
  console.log(chain.species.name);
  let res;
  // I really should've looked into the GraphQL API...
  switch (chain.species.name) {
    case 'deoxys':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/deoxys-normal`);
      break;
    case 'wormadam':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/wormadam-plant`);
      break;
    case 'giratina':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/giratina-altered`);
      break;
    case 'shaymin':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/shaymin-land`);
      break;
    case 'basculin':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/basculin-red-striped`);
      break;
    case 'basculegion':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/basculegion-male`);
      break;
    case 'darmanitan':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/darmanitan-standard`);
      break;
    case 'tornadus':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/tornadus-incarnate`);
      break;
    case 'thundurus':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/thundurus-incarnate`);
      break;
    case 'landorus':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/landorus-incarnate`);
      break;
    case 'keldeo':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/keldeo-ordinary`);
      break;
    case 'meloetta':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/meloetta-aria`);
      break;
    case 'meowstic':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/meowstic-male`);
      break;
    case 'aegislash':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/aegislash-shield`);
      break;
    case 'pumpkaboo':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/pumpkaboo-average`);
      break;
    case 'gourgeist':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/gourgeist-average`);
      break;
    case 'zygarde':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/zygarde-50`);
      break;
    case 'oricorio':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/oricorio-baile`);
      break;
    case 'lycanroc':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/lycanroc-midday`);
      break;
    case 'wishiwashi':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/wishiwashi-solo`);
      break;
    case 'minior':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/minior-red-meteor`);
      break;
    case 'mimikyu':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/mimikyu-disguised`);
      break;
    case 'toxtricity':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/toxtricity-amped`);
      break;
    case 'eiscue':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/eiscue-ice`);
      break;
    case 'indeedee':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/indeedee-male`);
      break;
    case 'morpeko':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/morpeko-full-belly`);
      break;
    case 'urshifu':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/urshifu-single-strike`);
      break;
    case 'enamorus':
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/enamorus-incarnate`);
      break;
    default:
      res = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
  }
  const json = await res.json();

  const id = json.id;
  const pokemon = chain.species.name;

  const type1 = json.types[0].type.name;
  const type2 = json.types[1]?.type?.name || null;

  const total = json.stats.map((x) => x.base_stat).reduce((a, b) => a + b);
  const hp = json.stats.find((x) => x.stat.name === 'hp').base_stat;
  const attack = json.stats.find((x) => x.stat.name === 'attack').base_stat;
  const defense = json.stats.find((x) => x.stat.name === 'defense').base_stat;
  const specialAttack = json.stats.find((x) => x.stat.name === 'special-attack').base_stat;
  const specialDefense = json.stats.find((x) => x.stat.name === 'special-defense').base_stat;
  const speed = json.stats.find((x) => x.stat.name === 'speed').base_stat;
  const isLegendary = await checkIfLegendary(pokemon);
  const isMythical = await checkIfMythical(pokemon);
  const evolvesInto = chain.evolves_to.map((x) => x.species.name) || [];
  const generation = generations[pokemon];

  data.push({ id, pokemon, type1, type2, total, hp, attack, defense, specialAttack, specialDefense, speed, generation, isLegendary, isMythical, evolvesInto });

  if (id % 10 === 0) console.log(`${data.length}th pokemon added`);
  if (chain.evolves_to.length === 0) return;

  for (const pokemon of chain.evolves_to) {
    await addPokemonData(pokemon);
  }
}
let err = 0;
async function getPokemonEvos(count = 1) {
  const res = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${count}`);
  let json;
  try {
    json = await res.json();
    err = 0;
  } catch {
    console.log(`Failed ${count} evo chain`);
    if (err++ > 10) return;
    return await getPokemonEvos(++count);
  }
  await addPokemonData(json.chain);
  console.log(`Chain #${count}`);
  await getPokemonEvos(++count);
}

async function getGenerationData(gen = 1) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
  let json;
  try {
    json = await res.json();
  } catch {
    return;
  }
  for (const pokemon of json.pokemon_species) {
    generations[pokemon.name] = gen;
  }
  return await getGenerationData(++gen);
}

async function main() {
  await getGenerationData();
  await getPokemonEvos();
  console.log('All Done!');
  fs.writeFileSync('./pokemon.json', JSON.stringify(data, null, 2));
}

main();
