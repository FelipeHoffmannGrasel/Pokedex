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

let pokedex_list = []
function addPokemonToPokedex(id, nome, front_img, back_img, types, stats, moves) {
    let pokemon = {
        id: id,
        nome: nome,
        front_img: front_img,
        back_img: back_img,
        types: types,
        stats: stats,
        moves: moves
    }
    
    pokedex_list.push(pokemon)
    pokedex_list.sort((a, b) => a.id - b.id);
}

function details_data(pokemon) {
    openDetailSideNav()

    // cor de fundo da pagina detalhes
    switch (pokemon.types[0]) {
        case "fire": document.getElementById("detail_sidenav").style.backgroundColor = "#fd7d24"; break;
        case "grass": document.getElementById("detail_sidenav").style.backgroundColor = "#9bcc50"; break;
        case "electric": document.getElementById("detail_sidenav").style.backgroundColor = "#eed535"; break;
        case "water": document.getElementById("detail_sidenav").style.backgroundColor = "#4592c4"; break;
        case "ground": document.getElementById("detail_sidenav").style.backgroundColor = "#ab9842"; break;
        case "rock": document.getElementById("detail_sidenav").style.backgroundColor = "#a38c21"; break;
        case "fairy": document.getElementById("detail_sidenav").style.backgroundColor = "#fdb9e9"; break;
        case "poison": document.getElementById("detail_sidenav").style.backgroundColor = "#b97fc9"; break;
        case "bug": document.getElementById("detail_sidenav").style.backgroundColor = "#729f3f"; break;
        case "dragon": document.getElementById("detail_sidenav").style.backgroundColor = "#53a4cf"; break;
        case "psychic": document.getElementById("detail_sidenav").style.backgroundColor = "#f366b9"; break;
        case "flying": document.getElementById("detail_sidenav").style.backgroundColor = "#bdb9b8"; break;
        case "fighting": document.getElementById("detail_sidenav").style.backgroundColor = "#d56723"; break;
        case "normal": document.getElementById("detail_sidenav").style.backgroundColor = "#a4acaf"; break;
        case "ghost": document.getElementById("detail_sidenav").style.backgroundColor = "#7b62a3"; break;
        case "steel": document.getElementById("detail_sidenav").style.backgroundColor = "#9eb7b8"; break;
        case "dark": document.getElementById("detail_sidenav").style.backgroundColor = "#707070"; break;
        case "ice": document.getElementById("detail_sidenav").style.backgroundColor = "#51c4e7"; break;
    }

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

// variavéis da paginação
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let offset = 0;
let limit = 20;

// voltar pra pagina anterior
previous.addEventListener('click', () => {
    if (offset >= 20) {
        offset -= 20;
        run_fetch();
    }
});

// ir pra proxima pagina
next.addEventListener('click', () => {
    offset += 20;
    run_fetch();
});


let counter = 0;
let pokemon_div = document.getElementById("pokemons_div")
function run_fetch() {
    pokemons_list = [];
    counter = 0;
    pokemon_div.innerHTML = "";
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`)
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

                        if (array.length == counter) {
                            showPokemons();
                        }
                    })
            })
        })
        .catch(err => console.log("erro: " + err))
}

run_fetch();
showPokemons = function () {

    // console.log(pokemons_list);
    pokemons_list.forEach(pokemon => {
        //////////////// pagina inicial /////////////////

        let pikamon = document.createElement("div"); pikamon.id = `pokemon_${pokemon.id}`; pikamon.className = 'pokemon'
        let img = document.createElement("img")
        let buttons_div = document.createElement("div")

        // cores dos cards
        switch (pokemon.types[0]) {
            case "fire": pikamon.style.backgroundColor = "#fd7d24"; break;
            case "grass": pikamon.style.backgroundColor = "#9bcc50"; break;
            case "electric": pikamon.style.backgroundColor = "#eed535"; break;
            case "water": pikamon.style.backgroundColor = "#4592c4"; break;
            case "ground": pikamon.style.backgroundColor = "#ab9842"; break;
            case "rock": pikamon.style.backgroundColor = "#a38c21"; break;
            case "fairy": pikamon.style.backgroundColor = "#fdb9e9"; break;
            case "poison": pikamon.style.backgroundColor = "#b97fc9"; break;
            case "bug": pikamon.style.backgroundColor = "#729f3f"; break;
            case "dragon": pikamon.style.backgroundColor = "#53a4cf"; break;
            case "psychic": pikamon.style.backgroundColor = "#f366b9"; break;
            case "flying": pikamon.style.backgroundColor = "#bdb9b8"; break;
            case "fighting": pikamon.style.backgroundColor = "#d56723"; break;
            case "normal": pikamon.style.backgroundColor = "#a4acaf"; break;
            case "ghost": pikamon.style.backgroundColor = "#7b62a3"; break;
            case "steel": pikamon.style.backgroundColor = "#9eb7b8"; break;
            case "dark": pikamon.style.backgroundColor = "#707070"; break;
            case "ice": pikamon.style.backgroundColor = "#51c4e7"; break;
        }

        // nome do pokemon no card
        let nome = document.createElement("p")
        nome.innerHTML = `#${pokemon.id} ${pokemon.nome.toUpperCase()}`

        // imagem do card
        img.src = `${pokemon.front_img}`;
        img.width = "100";
        img.height = "100";

        ////////////// pagina detalhes /////////////////
        let details = document.createElement("button")
        details.innerText = `Detalhes`;
        
        details.addEventListener('click', () => {
            details_data(pokemon)
        })

        ////////////// pagina pokedex //////////////////
        let add = document.createElement("button"); add.id = `add_${pokemon.id}`
        add.innerText = `Adicionar`; add.style.marginRight = "20px";

        // quando clica no botão adicionar
        add.onclick = function() {
            // adiciona o pokemon na lista da pokedex
            addPokemonToPokedex(
                pokemon.id,
                pokemon.nome,
                pokemon.front_img,
                pokemon.back_img,
                pokemon.types,
                pokemon.stats,
                pokemon.moves
            )
            
            // faz o mesmo pokemon adicionado sumir da página inicial
            document.getElementById(`pokemon_${pokemon.id}`).style.display = "None"
            console.log(pokedex_list)
        }

        // quando clica pra entrar na pokedex
        document.getElementById("open_pokedex").onclick = function() {
            document.getElementById('pokedex_div').innerHTML = "";
            pokedex_list.forEach(pokemon => {

                //cria a div de cada pokemon
                let poke_div = document.createElement("div"); 
                poke_div.id = `pokemon_${pokemon.nome}`; 
                poke_div.className = `pokemon`;

                //nome de cada div/pokemon
                let nome = document.createElement('p');  
                nome.innerHTML = `#${pokemon.id} ${pokemon.nome.toUpperCase()}`

                //imagem de cada div
                let img = document.createElement("img"); 
                img.src = pokemon.front_img; 
                img.width = "100"; 
                img.height = "100";

                // btn remover
                let remover = document.createElement("button"); 
                remover.innerText = `Remover`; remover.id = `remove`

                // btn detalhes
                let detalhes = document.createElement("button"); 
                detalhes.innerText = `Detalhes`; detalhes.id = 'detalhes'

                // quando clica no botão de detalhes
                detalhes.addEventListener('click', () => {
                    closePokedexSideNav()
                    details_data(pokemon)

                    // quando já está na pokedex e clica nos detalhes, quando fecha volta pra pokedex e não pra pagina inicial
                    document.getElementById('detail_closebtn').onclick = function() {
                        openPokedexSideNav()
                    }
                })

                // quando clica no botão remover
                remover.addEventListener('click', () => {
                    let divToRemove = document.getElementById(`pokemon_${pokemon.nome}`);
                    let container = document.getElementById('pokedex_div');
                    container.removeChild(divToRemove);

                    if (pokedex_list.indexOf(pokemon) !== -1) {
                        pokedex_list.splice(pokedex_list.indexOf(pokemon), 1);
                    }
                    document.getElementById(`pokemon_${pokemon.id}`).style.display = "inline";

                    addPokemonToArray(
                        pokemon.id,
                        pokemon.nome,
                        pokemon.front_img,
                        pokemon.back_img,
                        pokemon.types,
                        pokemon.stats,
                        pokemon.moves
                    )
                })

                // div dos botões
                let buttons_div = document.createElement("div")

                // cor de cada div/pokemon
                switch (pokemon.types[0]) {
                    case "fire": poke_div.style.backgroundColor = "#fd7d24"; break;
                    case "grass": poke_div.style.backgroundColor = "#9bcc50"; break;
                    case "electric": poke_div.style.backgroundColor = "#eed535"; break;
                    case "water": poke_div.style.backgroundColor = "#4592c4"; break;
                    case "ground": poke_div.style.backgroundColor = "#ab9842"; break;
                    case "rock": poke_div.style.backgroundColor = "#a38c21"; break;
                    case "fairy": poke_div.style.backgroundColor = "#fdb9e9"; break;
                    case "poison": poke_div.style.backgroundColor = "#b97fc9"; break;
                    case "bug": poke_div.style.backgroundColor = "#729f3f"; break;
                    case "dragon": poke_div.style.backgroundColor = "#53a4cf"; break;
                    case "psychic": poke_div.style.backgroundColor = "#f366b9"; break;
                    case "flying": poke_div.style.backgroundColor = "#bdb9b8"; break;
                    case "fighting": poke_div.style.backgroundColor = "#d56723"; break;
                    case "normal": poke_div.style.backgroundColor = "#a4acaf"; break;
                    case "ghost": poke_div.style.backgroundColor = "#7b62a3"; break;
                    case "steel": poke_div.style.backgroundColor = "#9eb7b8"; break;
                    case "dark": poke_div.style.backgroundColor = "#707070"; break;
                    case "ice": poke_div.style.backgroundColor = "#51c4e7"; break;
                }

                //monta cada div e adiciona no body da pagina
                buttons_div.appendChild(remover)
                buttons_div.appendChild(detalhes)
                poke_div.appendChild(nome)
                poke_div.appendChild(img)
                poke_div.appendChild(buttons_div)
                document.getElementById('pokedex_div').appendChild(poke_div)
            })

            openPokedexSideNav();
        }

        // cria a div que contém os cards de cada pokemon na página inicial
        buttons_div.appendChild(add)
        buttons_div.appendChild(details)
        pikamon.appendChild(nome)
        pikamon.appendChild(img)
        pikamon.appendChild(buttons_div)
        pokemon_div.appendChild(pikamon)
    })
}