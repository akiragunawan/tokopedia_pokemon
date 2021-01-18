
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


function Mypokemon() {
    const MySwal = withReactContent(Swal);
    const [dts, setDts] = useState([])
    var db;
    var request = window.indexedDB.open("pokemon_data", 1);
    //on error opening DB
    request.onerror = function (event) {
        console.log("error: ");
    };

    useEffect(() => {
        request.onsuccess = function (event) {
            db = request.result;
            console.log("connected to DB")

            db.transaction(['data'], 'readwrite').objectStore('data').getAll().onsuccess = function (event) {
                const { result } = event.target

                if (result) {
                    result.forEach(element => {
                        setDts(prevItems => [...prevItems, { id: element.id, poke: element.poke, img: element.image }])

                    });
                }



            }


        }
    }, [])


    //this code below for make the empty table
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        db.createObjectStore("data", {
            keyPath: "id"
        });
        console.log('success make table')
    }

    return (<div className="flexin">

        {dts.map(({ key, id, poke, img }) => (


            <div className="style_box" >
                <div>
                    <img src={img} alt="" className="styles_image" />
                    <h2 style={{ textAlign: 'center', textTransform: 'capitalize' }}>{id}</h2>

                </div>
                <div style={{ width: '100%', textAlign: 'center', textTransform: 'capitalize' }}>{poke}
                </div>
                <div className="release_btn_div" ><button
                    onClick={() => {
                        var request = window.indexedDB.open("pokemon_data", 1);
                        request.onsuccess = function (event) {
                            db = request.result;
                            console.log(db);
                            db.transaction(['data'], 'readwrite').objectStore('data').delete(id).onsuccess = function (event) {

                                MySwal.fire('Pokemon Release');
                            }
                            db.transaction(['data'], 'readwrite').objectStore('data').getAll().onsuccess = function (event) {
                                const { result } = event.target
                                setDts([]);
                                if (result) {
                                    result.forEach(element => {
                                        setDts(prevItems => [...prevItems, { id: element.id, poke: element.poke, img: element.image }])

                                    });
                                }



                            }

                        }
                    }}>Release</button></div>
            </div>


        ))}




    </div >)









}
export default Mypokemon;