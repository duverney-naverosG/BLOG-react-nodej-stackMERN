import { Link, useNavigate } from "react-router-dom";
import Seccion from "../components/Seccion";
import { useEffect, useState } from "react";
import { URL_API, URL_API2 } from "../config/URL";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-hot-toast";

function Publicaciones() {
    const navigate = useNavigate();
    const { currentUser,  logout} = useContext(AuthContext)
    const [publicaciones, setPublicaciones] = useState([]);

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    useEffect(() => {
        const cargarPublicaciones = async () => {
            const res = await fetch(URL_API + '/publicacionesUser', {
                headers: {
                    "Authorization": `Bearer ${currentUser.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
    
            if (res.status === 505) {
                toast.error('SESION EXPIRO');
                logout()
                navigate('/')
            }
    
            if (res.status === 502) {
                toast.error('TOKEN ADULTERADO');
            }
            
            setPublicaciones(data);
        }
        cargarPublicaciones()
    }, [currentUser.token, logout, navigate]);

    return (
        <div>
            <div className="hero overlay inner-page bg-primary py-5">
                <div className="container">
                    <div className="row align-items-center justify-content-center text-center pt-5">
                        <div className="col-lg-6">
                            <h1 className="heading text-white mb-3" >MIS PUBLICACIONES</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section search-result-wrap">
                <div className="container">

                    <div className="row posts-entry">
                        <div className="col-lg-8">

                            {publicaciones.length > 0 ?
                                (
                                    publicaciones.map((publicacion, index) => (
                                        <div className="blog-entry d-flex blog-entry-search-item" key={index}>
                                            {publicacion.foto ? (
                                                <Link to={"/Post?id="+publicacion._id} className="img-link me-4">
                                                    <img src={URL_API2+publicacion.foto} alt="Imag" className="img-fluid" />
                                                </Link>
                                            ) : (
                                                <Link to={"/Post?id="+publicacion._id} className="img-link me-4">
                                                    <img src="images/sinImagen.jpg" alt="Imag" className="img-fluid" />
                                                </Link>
                                            )}
                                            
                                            <div>
                                                <span className="date">{publicacion.createdAt.slice(0, 10)} <Link to={"/categoria?categoria="+publicacion.categoria[0]}>{publicacion.categoria[0]}</Link></span>
                                                <h2><Link to={"/Post?id="+publicacion._id}>{publicacion.titulo}</Link></h2>
                                                <p>{getText(publicacion.descripcion).slice(0, 200)}</p>
                                                <p><Link to={"/Post?id="+publicacion._id} className="btn btn-sm btn-outline-primary">leer mas</Link></p>
                                            </div>

                                        </div>
                                    ))
                                ) :
                                (<h2>SIN PUBLICACIONES</h2>)}
                        </div>

                        {/* <div className="row text-start pt-5 border-top">
                            <div className="col-md-12">
                                <div className="custom-pagination">
                                    <span>1</span>
                                    <Link to="#">2</Link>
                                    <Link to="#">3</Link>
                                    <Link to="#">4</Link>
                                    <span>...</span>
                                    <Link to="#">15</Link>
                                </div>
                            </div>
                        </div> */}

                        <div className="col-lg-4 sidebar">

                            <Link to="/EditPost" className="btn-flotante">AGREGAR POST</Link>
                            <Seccion />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Publicaciones;