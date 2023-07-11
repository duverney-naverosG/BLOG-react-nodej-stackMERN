import { useEffect, useState } from "react";
import { URL_API, URL_API2 } from "../config/URL";
import { Link } from "react-router-dom";

function Home() {
    const [publicaciones, setPublicaciones] = useState(null);
    const [publicacionesT, setPublicacionesT] = useState([]);

    const cargarPublicaciones = async () => {
        const res = await fetch(URL_API + '/ultimasPublicaciones');
        const data = await res.json();
        setPublicaciones(data);
    }

    const cargarPublicacionesT = async () => {
        const res = await fetch(URL_API + '/publicacionesHome');
        const data = await res.json();
        setPublicacionesT(data);
    }

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    useEffect(() => {
        cargarPublicaciones()
        cargarPublicacionesT()
    }, []);
    
    return (
        <div>
            <section className="section bg-light">
                <div className="container">
                    {publicaciones ? (
                        <div className="row align-items-stretch retro-layout">
                            <div className="col-md-4">
                                <Link to={"/Post?id=" + publicaciones[0]._id} className="h-entry mb-30 v-height gradient">

                                    {publicaciones[0].foto ? (
                                        <div className="featured-img" style={{ "backgroundImage": "url("+URL_API2+ publicaciones[0].foto + ")" }}></div>
                                    ) : (
                                        <div className="featured-img" style={{ "backgroundImage": "'images/sinImagen.jpg'" }}></div>
                                    )}

                                    <div className="text">
                                        <span className="date">{publicaciones[0].createdAt.slice(0, 10)}</span>
                                        <h2>{publicaciones[0].titulo}</h2>
                                    </div>
                                </Link>
                                <Link to={"/Post?id=" + publicaciones[1]._id} className="h-entry mb-30 v-height gradient">

                                    {publicaciones[1].foto ? (
                                        <div className="featured-img" style={{ "backgroundImage": "url("+URL_API2+ publicaciones[1].foto + ")" }}></div>
                                    ) : (
                                        <div className="featured-img" style={{ "backgroundImage": "'images/sinImagen.jpg'" }}></div>
                                    )}

                                    <div className="text">
                                        <span className="date">{publicaciones[1].createdAt.slice(0, 10)}</span>
                                        <h2>{publicaciones[1].titulo}</h2>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to={"/Post?id=" + publicaciones[2]._id} className="h-entry img-5 h-100 gradient">

                                    {publicaciones[2].foto ? (
                                        <div className="featured-img" style={{ "backgroundImage": "url("+URL_API2+ publicaciones[2].foto + ")" }}></div>
                                    ) : (
                                        <div className="featured-img" style={{ "backgroundImage": "'images/sinImagen.jpg'" }}></div>
                                    )}

                                    <div className="text">
                                        <span className="date">{publicaciones[2].createdAt.slice(0, 10)}</span>
                                        <h2>{publicaciones[2].titulo}</h2>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to={"/Post?id=" + publicaciones[3]._id} className="h-entry mb-30 v-height gradient">

                                    {publicaciones[3].foto ? (
                                        <div className="featured-img" style={{ "backgroundImage": "url("+URL_API2+ publicaciones[3].foto + ")" }}></div>
                                    ) : (
                                        <div className="featured-img" style={{ "backgroundImage": "'images/sinImagen.jpg'" }}></div>
                                    )}

                                    <div className="text">
                                        <span className="date">{publicaciones[3].createdAt.slice(0, 10)}</span>
                                        <h2>{publicaciones[3].titulo}</h2>
                                    </div>
                                </Link>
                                <Link to={"/Post?id=" + publicaciones[4]._id} className="h-entry mb-30 v-height gradient">

                                    {publicaciones[4].foto ? (
                                        <div className="featured-img" style={{ "backgroundImage": "url("+URL_API2+ publicaciones[4].foto + ")" }}></div>
                                    ) : (
                                        <div className="featured-img" style={{ "backgroundImage": "'images/sinImagen.jpg'" }}></div>
                                    )}

                                    <div className="text">
                                        <span className="date">{publicaciones[4].createdAt.slice(0, 10)}</span>
                                        <h2>{publicaciones[4].titulo}</h2>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-center spinner-border text-dark" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <section className="section">
                        {publicacionesT.map((publicacion, index) => (
                            <div className="container" key={index}>
                                <div className="row mb-4">
                                    <div className="col-sm-6">
                                        <h2 className="posts-entry-title">{publicacion.nombre}</h2>
                                    </div>
                                    <div className="col-sm-6 text-sm-end"><Link to={"/categoria?categoria=" + publicacion.nombre} className="read-more">VER TODO</Link></div>
                                </div>

                                <div className="row">
                                    {publicacion.cant.map((post, index) => (
                                        <div className="col-lg-4 mb-4" key={index}>
                                            <div className="post-entry-alt" key={index}>
                                                {post.foto ? (
                                                    <Link to={"/Post?id=" + post._id} className="img-link">
                                                        <img src={URL_API2+post.foto} alt="Imag" className="img-fluid" />
                                                    </Link>
                                                ) : (
                                                    <Link to={"/Post?id=" + post._id} className="img-link">
                                                        <img src="images/sinImagen.jpg" alt="Imag" className="img-fluid" />
                                                    </Link>
                                                )}

                                                <div className="excerpt">
                                                    <h2><Link to={"/Post?id=" + post._id}>{post.titulo}</Link></h2>
                                                    <div className="post-meta align-items-center text-left clearfix">
                                                        <figure className="author-figure mb-0 me-3 float-start">
                                                            {post.usuario[2] ? (
                                                                <img src={URL_API2+post.usuario[2]} alt="Imag" className="img-fluid" />
                                                            ): (
                                                                <img src="images/perfilUser.png" alt="Imag" className="img-fluid" />
                                                            )}
                                                            
                                                        </figure>
                                                        <span className="d-inline-block mt-1">POR: {post.usuario[1]}</span>
                                                        <br/>
                                                        <span>{post.createdAt.slice(0, 10)}</span>
                                                    </div>

                                                    <p>{getText(post.descripcion).slice(0, 200)}</p>
                                                    <p><Link to={"/Post?id=" + post._id} className="read-more">Continuar leyendo</Link></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </section>
                </div>
            </section>
        </div>
    );
}

export default Home;