import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { URL_API } from "../config/URL";

function Footer() {

    const [publicaciones, setPublicaciones] = useState([]);

    const cargarPublicaciones = async () => {
        const res = await fetch(URL_API + '/ultimasPublicaciones');
        const data = await res.json();
        setPublicaciones(data);
    }

    useEffect(() => {
        cargarPublicaciones()
    }, []);

    return (
        <footer className="site-footer">
            <div className="mx-5">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="widget">
                            <h3 className="mb-4">ACERCA</h3>
                            <p>Este blog se darroolo como idea para un portafolio web, utilizando la tecnologia de React y uso de hook <br/> 
                                conectado a una API desarrollada en nodejs y uso de mongoDB como base de datos
                            </p>
                        </div>
                        <div className="widget">
                            <h3>Social</h3>
                            <ul className="list-unstyled social">
                                <li><Link to="#"><span className="icon-instagram"></span></Link></li>
                                <li><Link to="#"><span className="icon-twitter"></span></Link></li>
                                <li><Link to="#"><span className="icon-facebook"></span></Link></li>
                                <li><Link to="#"><span className="icon-linkedin"></span></Link></li>
                                <li><Link to="#"><span className="icon-pinterest"></span></Link></li>
                                <li><Link to="#"><span className="icon-dribbble"></span></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 ps-lg-5"></div>

                    <div className="col-lg-4">
                        <div className="widget">
                            <h3 className="mb-4">Ultimos Post</h3>
                            <div className="post-entry-footer">
                                <ul>
                                    {publicaciones.map((publicacion, index) => (
                                        <li key={index}>
                                            <Link to={"/Post?id=" + publicacion._id}>
                                                {publicacion.foto ? (
                                                    <Link to={"/Post?id=" + publicacion._id} className="img-link me-4">
                                                        <img src={`http://localhost:5000/images/${publicacion.foto}`} alt="Imag"/>
                                                    </Link>
                                                ) : (
                                                    <Link to={"/Post?id=" + publicacion._id} className="img-link me-4">
                                                        <img src="images/sinImagen.jpg" alt="Imag" className="img-fluid" />
                                                    </Link>
                                                )}
                                                <div className="text">
                                                    <h4>{publicacion.titulo}</h4>
                                                    <div className="post-meta">
                                                        <span className="mr-2">{publicacion.createdAt.slice(0, 10)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p>Copyright &copy;<script>document.write(new Date().getFullYear());</script>. Derechos reservados. &mdash; hecho with love ❤ by <span > DUVERNEY NAVEROS</span>  Distributed by <Link to="https://themewagon.com">ThemeWagon</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;