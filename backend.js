function openDetailSideNav() {
    document.getElementById("detail_sidenav").style.width = "100%";
}

function closeDetailSideNav() {
    document.getElementById("detail_sidenav").style.width = "0";
    document.getElementById("details_list").innerHTML = "";
    document.getElementById("types").innerHTML = "";
    document.getElementById("moves").innerHTML = "";
}
function openPokedexSideNav() {
    document.getElementById("pokedex_sidenav").style.width = "100%";
}

function closePokedexSideNav() {
    document.getElementById("pokedex_sidenav").style.width = "0";
}

let pokemons_list = []
function addPokemonToArray(id, nome, front_img, back_img, types, stats, moves) {
    let pokemon = {
        id: id,
        nome: nome,
        front_img: front_img,
        back_img: back_img,
        types: types,
        stats: stats,
        moves: moves
    }

    pokemons_list.push(pokemon)
    pokemons_list.sort((a, b) => a.id - b.id);
}

function remove_from_index(id) {
    let pokemon_to_remove = document.getElementById(`pokemon_${id}`)

    pokemon_to_remove.remove()
}

let counter = 0;

fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=40`)
    .then(response => response.json())
    .then(function (json) {
        json.results.forEach((data, index, array) => {
            fetch(data.url)
                .then(response => response.json())
                .then(function (pokemon) {
                    // console.log(pokemon)

                    let id = pokemon.id;
                    let nome_pokemon = pokemon.name;
                    let front_img = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
                    let back_img = pokemon.sprites.versions['generation-v']['black-white'].animated.back_default;
                    let types = pokemon.types.map(type => type.type.name);
                    let stats = pokemon.stats.map(stat => { return { nome: stat.stat.name } })
                    let moves = pokemon.moves.slice(0, 5).map(move => move.move.name)

                    addPokemonToArray(
                        id,
                        nome_pokemon,
                        front_img,
                        back_img,
                        types,
                        stats,
                        moves
                    )
                    
                    counter++;

                    if(array.length == counter) {
                        showPokemons();
                    }
                })
        })
    })
    .catch(err => console.log("erro: " + err))
showPokemons = function() {
    
    // console.log(pokemons_list);
pokemons_list.forEach(pokemon => {
    //////////////// pagina inicial /////////////////
    let pokemon_div = document.getElementById("pokemon_div")
    let pikamon = document.createElement("div"); pikamon.id = `pokemon_${pokemon.id}`; pikamon.className = 'pokemon'
    let img = document.createElement("img")
    let buttons_div = document.createElement("div")

    // nome do pokemon no card
    let nome = document.createElement("p")
    nome.innerText = pokemon.nome.toUpperCase()

    // imagem do card
    img.src = `${pokemon.front_img}`;
    img.width = "100";
    img.height = "100";

    ////////////// pagina detalhes /////////////////
    let details = document.createElement("button")
    details.innerText = `Detalhes`;
    details.onclick = function () {
        openDetailSideNav()

        // Nome do pokemon na pagina detalhe
        document.getElementById("header_name").innerText = pokemon.nome.toUpperCase()

        // imagens frente e verso da pagina
        document.getElementById("front_img").src = `${pokemon.front_img}`
        document.getElementById("back_img").src = `${pokemon.back_img}`

        // for pra criar a lista de status // max 5 status na list
        for (let i = 0; i < 5; i++) {
            let status = document.createElement("p"); status.id = "div_status"
            status.innerHTML = `${pokemon.stats[i].nome}`
            document.getElementById("details_list").appendChild(status)
        }

        // gambiarra pra n dar erro no for se a quantidade de tipos é menor q 3
        console.log(pokemon.types)
        let length = pokemon.types.length > 2 ? 2 : pokemon.types.length;

        // for pra criar a lista de tipos // max 3 tipos
        for (let i = 0; i < length; i++) {
            let type = document.createElement("div"); type.id = "type_div"
            type.innerHTML = `${pokemon.types[i]}`
            document.getElementById("types").appendChild(type)
        }

        // for pra criar a lista de movimentos // max 4
        for (let i = 0; i < 3; i++) {
            let move = document.createElement("p"); move.id = "move_p"
            move.innerHTML = `${pokemon.moves[i]}`
            document.getElementById("moves").appendChild(move)
        }
    }

    ////////////// pagina pokedex //////////////////
    let add = document.createElement("button")
    add.innerText = `Adicionar`; add.style.marginRight = "20px"

    // add.onclick = remove_from_index(pokemon.id)

    buttons_div.appendChild(add)
    buttons_div.appendChild(details)
    pikamon.appendChild(nome)
    pikamon.appendChild(img)
    pikamon.appendChild(buttons_div)
    pokemon_div.appendChild(pikamon)
})
}