import React, { useState } from "react";
import { gql, useQuery } from '@apollo/client';
import '../style.css';
import masterball from '../assets/image/master_ball.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const GET_POKEMONS_DETAIL = gql`
  query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    sprites {
      front_default
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        name
      }
    }
  }
}
`;

function Poke_Detail({ match }) {
    const MySwal = withReactContent(Swal);
    const [name] = useState(match.params.id);

    const [number, setNumber] = useState(Math.round(Math.random()));
    const { error, loading, data } = useQuery(GET_POKEMONS_DETAIL, {
        variables: {
            name
        }
    });
    var db;
    var request = window.indexedDB.open("pokemon_data", 1);
    request.onerror = function (event) {
        console.log("error: ");
    };

    request.onsuccess = function (event) {
        db = request.result;
        console.log(db);

    };

    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        db.createObjectStore("data", {
            keyPath: "id"
        });
    }





    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;


    return (<div className="detail_page">
        <div className="data_center">
            <img className="img_poke_detail" src={data.pokemon.sprites.front_default} alt="" width="300" />

        </div>
        <div className="poke_name">
            <h1>{match.params.id}</h1>
        </div>
        <div className="type_div">
            {data.pokemon.types.map(({ type }) => (
                <h2 className="poke_type">{type.name}</h2>
            ))}
        </div>

        <div className="moves_container">
            <div className="moves_title_div">
                <h1 className="moves_title">Moves</h1>
            </div>
            <div className="moves_div">
                {data.pokemon.moves.map(({ move }) => (
                    <h3 className="move">{move.name}</h3>
                ))}
            </div>
        </div>
        <div className="catch_div">
            <a onClick={() => {
                setNumber(Math.round(Math.random()));

                if (number === 0) {

                    MySwal.fire({
                        input: 'text',
                        inputLabel: 'Enter a Nickname',
                        inputPlaceholder: 'Type your Nickname',
                        confirmButtonText: 'Look up',
                        showCancelButton: true
                    }).then((result) => {

                        if (result.isConfirmed) {



                            var request = db.transaction(['data'], 'readwrite').objectStore('data');


                            request.openCursor().onsuccess = function (event) {
                                var cursor = event.target.result;
                                console.log(cursor)

                                if (!cursor) {
                                    var request = db.transaction(["data"], "readwrite")
                                        .objectStore("data").add({
                                            id: result.value,
                                            poke: match.params.id,
                                            image: data.pokemon.sprites.front_default
                                        });

                                    request.onsuccess = function (event) {
                                        MySwal.fire('success adding')
                                    };

                                    request.onerror = function (event) {
                                        alert("error");
                                    }
                                } else if (cursor) {
                                    if (cursor.value.id !== result.value) {
                                        MySwal.fire('Pokemon Added!')
                                        request = db.transaction(["data"], "readwrite")
                                            .objectStore("data").add({
                                                id: result.value,
                                                poke: match.params.id,
                                                image: data.pokemon.sprites.front_default

                                            });

                                        request.onsuccess = function (event) {

                                            MySwal.fire('success adding')
                                        };

                                        request.onerror = function (event) {
                                            MySwal.fire('Nickname Already Exists!')
                                        }

                                    } else if (cursor.value.id === result.value) {
                                        MySwal.fire('Nickname Already Exists!')
                                    }


                                }


                            };
                        }
                    })










                } else if (number === 1) {
                    MySwal.fire({
                        title: <p className="text_roboto">It Got Away!</p>

                    })
                }
            }}
                className="catch">
                <img src={masterball} alt="" width="100" />

            </a>
            <h2 className="catch_text">Catch!</h2>
        </div>

    </div >);

}
export default Poke_Detail;