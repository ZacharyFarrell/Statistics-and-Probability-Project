# Data from [Pokeapi](https://pokeapi.co/)

Data based off this data set: https://github.com/nurfnick/Data_Sets_For_Stats/blob/master/CuratedDataSets/pokemon.csv
but with an column for what each pokemon evolves into, if any. Side effect of having more cases and removed duplicate pokemon species.

`generatePokemonJson.js` gets data from Pokeapi and saves a json to current directory as `pokemon.json`.

`pokemonJsonToCsv.js` reads from the `pokemon.json` that `generatePokemonJson.js` generates and saves a CSV to current directory as `pokemon.csv`.

Run with `node <file>`
