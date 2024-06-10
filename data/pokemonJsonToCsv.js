const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./pokemon.json'));

let file = '#,Pokemon,Type 1,Type 2,Total,HP,Attack,Defense,Special Attack,Special Defense,Speed,Generation,Legendary,Mythical,Evolves Into';
for (const { id, pokemon, type1, type2, total, hp, attack, defense, specialAttack, specialDefense, speed, isLegendary, isMythical, generation, evolvesInto } of data) {
  file += `\n${id},${pokemon},${type1},${type2 || ''},${total},${hp},${attack},${defense},${specialAttack},${specialDefense},${speed},${generation},${isLegendary},${isMythical},"${evolvesInto}"`;
}
fs.writeFileSync('./pokemon.csv', file);
