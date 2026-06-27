import { useEffect, useState } from "react";
import logo from "./assets/pokemon-logo.png";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);

  useEffect(() => {
    carregarPokemon();
  }, []);

  async function carregarPokemon() {
    setCarregando(true);

    try {
      const resposta = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=30"
      );

      const dados = await resposta.json();

      const detalhes = await Promise.all(
        dados.results.map(async (poke) => {
          const res = await fetch(poke.url);
          return await res.json();
        })
      );

      setPokemon(detalhes);
    } catch (erro) {
      console.log("Erro ao buscar Pokémon", erro);
    }

    setCarregando(false);
  }

  const listaFiltrada = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="app">
      
      <img
      src="/pokemon-logo.png" className="logoPokemon" alt="Pokémon"/>

      <header>

        <h1>Pokédex</h1>

        <p>
          Explore os Pokémon utilizando a PokéAPI
        </p>

      </header>

      <div className="pesquisa">

        <input
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

      </div>

      {carregando ? (

        <div className="loading">

          <div className="spinner"></div>

          <h2>Carregando Pokémons...</h2>

        </div>

      ) : (

        <div className="container">

          {listaFiltrada.map((poke) => (

            <div
                className="card" key={poke.id}  onClick={() => setPokemonSelecionado(poke)}>

              <span className="numero">

                #{poke.id}

              </span>

              <img
                src={poke.sprites.other["official-artwork"].front_default}
                alt={poke.name}
              />

              <h2>
                {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
              </h2>

              <div className="tipos">

                {poke.types.map((tipo) => (

                  <span
                    key={tipo.slot}
                    className={`tipo ${tipo.type.name}`}
                  >
                    {tipo.type.name}
                  </span>

                ))}

              </div>

              <div className="info">

                <div>

                  <h4>Altura</h4>

                  <p>{poke.height / 10} m</p>

                </div>

                <div>

                  <h4>Peso</h4>

                  <p>{poke.weight / 10} kg</p>

                </div>

              </div>

              <div className="habilidades">

                <h4>Habilidades</h4>

                <ul>

                  {poke.abilities.map((habilidade) => (

                    <li key={habilidade.ability.name}>
                      {habilidade.ability.name}
                    </li>

                  ))}

                </ul>

              </div>

            </div>

          ))}

        </div>

      )}

      {pokemonSelecionado && (

    <div className="modal">

      <div className="modal-card">

      <button
        className="fechar"
        onClick={() => setPokemonSelecionado(null)}>

        ✖

      </button>

        <img
        src={pokemonSelecionado.sprites.other["official-artwork"].front_default}
        alt={pokemonSelecionado.name}
        />

        <h2>

        {pokemonSelecionado.name.charAt(0).toUpperCase() +
        pokemonSelecionado.name.slice(1)}

        </h2>

        <h3>Informações</h3>

          <p>

          <strong>ID:</strong> #{pokemonSelecionado.id}

          </p>

          <p>

          <strong>Altura:</strong> {pokemonSelecionado.height/10} m

          </p>

          <p>

          <strong>Peso:</strong> {pokemonSelecionado.weight/10} kg

          </p>

        <h3>Tipos</h3>

      <div className="tipos">

      {pokemonSelecionado.types.map(tipo => (

      <span
      key={tipo.slot}
      className={`tipo ${tipo.type.name}`}
      >

      {tipo.type.name}

      </span>

      ))}

      </div>

      <h3>Estatísticas</h3>

      {pokemonSelecionado.stats.map(stat => (

      <div className="status" key={stat.stat.name}>

      <div className="status-top">

      <span>{stat.stat.name}</span>

      <span>{stat.base_stat}</span>

      </div>

      <div className="barra">

      <div
      className="preenchimento"
      style={{width:`${Math.min(stat.base_stat,100)}%`}}
      ></div>

      </div>

      </div>

      ))}

      </div>

      </div>

      )}

    

    </div>
  );
}

export default App;