const fs = require('fs');

const data = fs.readFileSync('./pokemon.csv', 'utf8');
const json = [];

for (const pokemon of data.split('\n')) {
  const [pokedexNumber, pokemonName, type1, type2, statTotal, healthStat, attackStat, defenseStat, specialAttackStat, specialDefenseStat, speedStat, generation, legendary] = pokemon.split(',');

  if (pokedexNumber === '#') continue; // Skip the header

  json.push({
    pokedexNumber: parseInt(pokedexNumber),
    pokemonName: pokemonName,
    type1: type1,
    type2: type2 || null,
    stats: {
      total: parseInt(statTotal),
      health: parseInt(healthStat),
      attack: parseInt(attackStat),
      defense: parseInt(defenseStat),
      specialAttack: parseInt(specialAttackStat),
      specialDefense: parseInt(specialDefenseStat),
      speed: parseInt(speedStat),
    },
    generation: parseInt(generation),
    legendary: legendary === 'TRUE' ? true : false,
  });
}
console.log(json);
fs.writeFileSync('./pokemon.json', JSON.stringify(json, null, 2), { flag: 'wx' });
