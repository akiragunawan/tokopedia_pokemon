import React, { useState } from "react";
import { gql, useQuery } from '@apollo/client';
import '../style.css';
import { Link, Switch } from "react-router-dom";
const GET_POKEMONS = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      count
      next
      previous
      status
      message
      results {
        url
        name
        image
      }
    }
  }
`;

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
function GetPokemon() {
    const [limit, setLimit] = useState(10);
    const { error, loading, data, fetchMore } = useQuery(GET_POKEMONS, {
        variables: {
            limit, offset: 1
        }
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div>
            <Switch>
                <div className="flexin">
                    {data.pokemons.results.map(({ name, image }) => (

                        <Link className="link" to={`/poke_detail/${name}`} >
                            <div className="style_box">
                                <div>
                                    <img src={image} alt="" className="styles_image" />
                                    <h2>{name}</h2>
                                </div>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="div_btn">
                        <button className="btn-load" onClick={() => {
                            fetchMore({
                                variables: {
                                    offset: 1,
                                    limit: limit,
                                },
                            }).then(fetchMoreResult => {

                                setLimit(limit + 10);
                            });
                        }}>Load More</button>
                    </div>
                </div>
            </Switch>
        </div >
    );
}
export default GetPokemon;