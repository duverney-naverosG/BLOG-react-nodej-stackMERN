import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { URL_API } from "../config/URL";

function Seccion() {

    const [categorias, setCategorias] = useState([]);;

    const cargarCategorias = async () => {
        const res = await fetch(URL_API + '/categoriaCant');
        const data = await res.json();
        setCategorias(data);
    }

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <>
            <div className="sidebar-box">
                <h3 className="heading">Categorias</h3>
                <ul className="categories">
                    {
                        categorias.map((categoria, index) => (
                            <li><Link key={index} className="nav-link" to={"/categoria?categoria=" + categoria.nombre}>{categoria.nombre}<span>({categoria.cant})</span></Link></li>
                        ))
                    }

                </ul>
            </div>
        </>
    );
}

export default Seccion;