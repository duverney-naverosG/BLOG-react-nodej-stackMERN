import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { URL_API } from "../config/URL";

function Menu() {

    const { currentUser, logout } = useContext(AuthContext);
    const [categorias, setCategorias] = useState([]);

    const cargarCategorias = async () => {
        const res = await fetch(URL_API + '/categorias');
        const data = await res.json();
        setCategorias(data);
    }

    useEffect(() => {
        cargarCategorias()
    }, []);

    return (
        <div className="sticky-top">
            <nav className="navbar navbar-expand-lg  d-none d-lg-block" id="templatemo_nav_top" style={{ "backgroundColor": "#214252" }}>
                <div className="container text-light">
                    <div className="w-100 d-flex justify-content-between">
                        <div>
                            <i className="fa fa-envelope mx-2"></i>
                            <Link className="navbar-sm-brand text-light text-decoration-none" to={"mailto: duvernaved16@gmail.com"}>duvernaved16@gmail.com</Link>
                            <i className="fa fa-phone mx-2"></i>
                            <Link className="navbar-sm-brand text-light text-decoration-none" to={"tel:320-9295993"}>320-9295993</Link>
                        </div>
                        <div>
                            <Link className="text-light" to="https://fb.com/templatemo" target="_blank" rel="sponsored"><i className="fab fa-facebook-f fa-sm fa-fw me-2"></i></Link>
                            <Link className="text-light" to="https://www.instagram.com/" target="_blank"><i className="fab fa-instagram fa-sm fa-fw me-2"></i></Link>
                            <Link className="text-light" to="https://twitter.com/" target="_blank"><i className="fab fa-twitter fa-sm fa-fw me-2"></i></Link>
                            <Link className="text-light" to="https://www.linkedin.com/" target="_blank"><i className="fab fa-linkedin fa-sm fa-fw"></i></Link>
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container d-flex justify-content-between align-items-center">

                    <Link className="navbar-brand text-white logo h1 align-self-center" to={'/'}>
                        <strong>NAVEROSITY</strong>
                    </Link>

                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#templatemo_main_nav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="align-self-center collapse navbar-collapse flex-fill  d-lg-flex justify-content-lg-between" id="templatemo_main_nav">
                        <div className="flex-fill">
                            <ul className="nav navbar-nav d-flex justify-content-center mx-lg-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                {categorias.map((categoria, index) => (
                                    <li key={index} className="nav-item">
                                        <Link className="nav-link" to={"/categoria?categoria=" + categoria.nombre}>{categoria.nombre}</Link>
                                    </li>
                                ))}
                                {
                                    currentUser ? (
                                        currentUser.usuarios.rol === 'admin' ? (
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/categorias">CATEGORIAS</Link>
                                            </li>)
                                            : (null)
                                    ) :
                                        (null)
                                }

                            </ul>
                        </div>
                        <div className="navbar align-self-center d-flex">
                            <li className="nav-item dropdown d-lg-inline text-white">
                                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-fw fa-user text-white mr-3"></i>
                                </Link>
                                <ul className="dropdown-menu">
                                    {
                                        currentUser ?
                                            (<>
                                                <li><Link className="dropdown-item" to="/perfil">PERFIL</Link></li>
                                                <li><Link className="dropdown-item" to="/publicaciones">MIS PUBLICACIONES</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="btn btn-outline-danger dropdown-item " onClick={logout}>SALIR</button></li>
                                            </>
                                            ) :
                                            (<>
                                                <li><Link className="dropdown-item" to="/registro">REGISTRASE</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><Link className="btn btn-outline-success dropdown-item " to="/login">INICIAR SESION</Link></li>
                                            </>
                                            )
                                    }
                                </ul>
                            </li>

                        </div>
                    </div>

                </div>
            </nav>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default Menu;