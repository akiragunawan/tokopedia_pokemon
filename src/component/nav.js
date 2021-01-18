import pokemon_img from '../assets/image/pokemon.png';
import pokeball from '../assets/image/pokeball.png'
import compass from '../assets/image/compass.png'
import { Link, Switch } from "react-router-dom";
import react, { useState } from 'react';






function Nav() {
    const [active1, setActive1] = useState(true);
    const [active2, setActive2] = useState(false);
    const clicing1 = () => {
        setActive1(true)
        setActive2(false)
    }
    const clicing2 = () => {
        setActive2(true)
        setActive1(false)
    }


    var db;
    var request = window.indexedDB.open("pokemon_data", 1);
    const [cnt, setCnt] = useState([]);

    request.onsuccess = function (event) {
        db = request.result;
        console.log("connected to DB")

        db.transaction(['data'], 'readwrite').objectStore('data').getAll().onsuccess = function (event) {
            const { result } = event.target;

            if (result) {
                setCnt(result.length)


            };
        }
    }








    return (
        <div>

            <Switch>


                <div className="nav_back">
                    <Link className="link_menu" onClick={clicing1} to={'/'}>
                        <div className="btn">
                            <div className="poke_img">
                                <a>
                                    <img src={pokemon_img} alt="" width="150" />
                                </a>
                            </div>

                        </div>
                    </Link>
                    <div className="menus">
                        <Link className={`link_menu ${active1 ? "active" : ""}`} onClick={clicing1} to={'/'}>
                            <div className="btn">

                                <a className="pokeball">
                                    <div className="image_btn">
                                        <img src={compass} alt="" width="50" />
                                    </div>
                                    <div className="text_btn">
                                        <p className="text_my">Explore</p>
                                        <p className="text_my">The</p>
                                        <p className="text_my">Pokemons</p>
                                    </div>
                                </a>


                            </div>
                        </Link>

                        <Link className={`link_menu ${active2 ? "active" : ""}`} onClick={clicing2} to={'/mypokemons'}>
                            <div className="btn">

                                <a className="pokeball">
                                    <div className="image_btn">
                                        <img src={pokeball} alt="" width="50" />
                                    </div>
                                    <div className="text_btn">
                                        <p className="text_my">You have</p>
                                        <p className="text_my cnt" >{cnt} </p>
                                        <p className="text_my"> Pokemon</p>
                                    </div>
                                </a>


                            </div>
                        </Link>
                    </div>

                </div>

            </Switch> </div >)
}
export default Nav;