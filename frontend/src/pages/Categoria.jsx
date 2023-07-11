import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Seccion from "../components/Seccion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { URL_API, URL_API2 } from "../config/URL";

function Categoria() {

    const [searchParams] = useSearchParams()
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionesS, setPublicacionesS] = useState([]);
    const navigate = useNavigate();

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/search?titulo=${e.target[0].value}`)
    };

    useEffect(() => {
        if (searchParams.get('categoria') === null) {
            navigate('/')
        } else {
            const cargarPublicaciones = async () => {
                const res = await fetch(URL_API + '/publicacionesCategoria/' + searchParams.get('categoria'));
                const data = await res.json();
                if (res.status === 500) {
                    toast.error('CATEGORIA NO ENCONTRADA');
                    navigate('/')
                }
                setPublicaciones(data);
            }
            cargarPublicaciones();
        }

    }, [navigate, searchParams]);

    return (
        <div className="section search-result-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="heading">Categoria: {searchParams.get('categoria')}</div>
                    </div>
                </div>
                <div className="row posts-entry">
                    <div className="col-lg-8">
                        {
                            publicaciones.length > 0 ?
                                (
                                    publicaciones.map((publicacion, index) => (
                                        <div className="blog-entry d-flex blog-entry-search-item" key={index}>
                                            {publicacion.foto ? (
                                                <Link to={"/Post?id=" + publicacion._id} className="img-link me-4">
                                                    <img src={URL_API2+publicacion.foto} alt="Imag" className="img-fluid" />
                                                </Link>
                                            ) : (
                                                <Link to={"/Post?id=" + publicacion._id} className="img-link me-4">
                                                    <img src="images/sinImagen.jpg" alt="Imag" className="img-fluid" />
                                                </Link>
                                            )}

                                            <div>
                                                <span className="date">{publicacion.createdAt.slice(0, 10)} <Link to={"/categoria?categoria=" + publicacion.categoria[0]}>{publicacion.categoria[0]}</Link></span>
                                                <h2><Link to={"/Post?id=" + publicacion._id}>{publicacion.titulo}</Link></h2>
                                                <p>{getText(publicacion.descripcion).slice(0, 200)}</p>
                                                <p><Link to={"/Post?id=" + publicacion._id} className="btn btn-sm btn-outline-primary">leer mas</Link></p>
                                            </div>

                                        </div>
                                    ))
                                ) :
                                (<h2>SIN PUBLICACIONES</h2>)
                        }

                        {/* <div className="row text-start pt-5 border-top">
                            <div className="col-md-12">
                                <div className="custom-pagination">
                                    <span>1</span>
                                    <a href="#">2</a>
                                    <a href="#">3</a>
                                    <a href="#">4</a>
                                    <span>...</span>
                                    <a href="#">15</a>
                                </div>
                            </div>
                        </div> */}

                    </div>

                    <div className="col-lg-4 sidebar">

                        <div className="sidebar-box search-form-wrap mb-4">
                            <form onSubmit={handleSubmit} className="sidebar-search-form">
                                <span className="bi-search"></span>
                                <input type="text" className="form-control" name="titulo" placeholder="Titulo del post y enter" />
                            </form>
                        </div>
                        <Seccion />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categoria;