import { Link, useSearchParams } from "react-router-dom";
import Seccion from "../components/Seccion";
import { useEffect, useState } from "react";
import { URL_API, URL_API2 } from "../config/URL";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

function Post() {
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(AuthContext)
    const [searchParams] = useSearchParams()
    const [publicacion, setPublicacion] = useState(null);

    const handleEliminar = () => {
        Swal.fire({
            title: 'DESEA ELIMINAR ESTE POST',
            text: "accion irrevesible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminar()
            }
        })
    }

    const eliminar = async () => {
        const res = await fetch(URL_API + '/publicaciones/' + publicacion._id, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            },
        });

        if (res.status === 200) {
            toast.success('PUBLICACION ELIMINADA');
            navigate("/publicaciones");
        }

        if (res.status === 502) {
            logout()
        }

        if (res.status === 500) {
            toast.error('ERROR INTERNO');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/search?titulo=${e.target[0].value}`)
    };


    useEffect(() => {
        if (searchParams.get('id') === null) {
            navigate('/')
        } else {
            const cargarPublicacion = async () => {
                const res = await fetch(URL_API + '/publicaciones/' + searchParams.get('id'));
                const data = await res.json();
                if (res.status === 500) {
                    toast.error('PUBLICACION NO ENCONTRADA');
                    navigate('/')
                }
                setPublicacion(data);
            }
            cargarPublicacion()
        }

    }, [navigate, searchParams]);

    return (
        <div>
            {publicacion ? (
                <>
                    <div className="site-cover site-cover-sm same-height overlay single-page">
                        <div className="container">
                            <div className="row same-height justify-content-center">
                                <div className="col-md-6">
                                    <div className="post-entry text-center">
                                        <h1 className="mb-4">{publicacion.titulo}</h1>
                                        <div className="post-meta align-items-center text-center">
                                            <figure className="author-figure mb-0 me-3 d-inline-block"><img src={publicacion.usuario[2] ? URL_API2+publicacion.usuario[2] : "images/perfilUser.png"} alt="Imag" className="rounded-circle " style={{ "width": "50px", "height": "50px" }} /></figure>
                                            <span className="d-inline-block mt-1">POR: {publicacion.usuario[1]}</span>
                                            <span>&nbsp;-&nbsp; {publicacion.createdAt.slice(0, 10)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="section">
                        <div className="container">

                            <div className="row blog-entries element-animate">

                                <div className="col-md-12 col-lg-8 main-content">

                                    <div className="post-content-body">
                                        <div className="row my-1">
                                            {publicacion.foto ? (<div className="col-md-12 mb-12">
                                                <img src={URL_API2+publicacion.foto} alt="Image_placeholder" className="img-fluid rounded" />
                                            </div>) : (null)}

                                        </div>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(publicacion.descripcion),
                                            }}
                                        ></p>
                                    </div>


                                    <div className="pt-5">
                                        {
                                            currentUser && (
                                                currentUser.usuarios._id === publicacion.usuario[0] && (
                                                    <div className="btn-group my-2" role="group" aria-label="Basic mixed styles example">
                                                        <Link type="button" to={"/EditPost?id=" + publicacion._id} className="btn btn-outline-warning">editar</Link>
                                                        <button type="button" onClick={handleEliminar} className="btn btn-outline-danger">eliminar</button>
                                                    </div>
                                                )
                                            )
                                        }

                                        <p>Categoria:  <Link to={"/categoria?categoria=" + publicacion.categoria[0]}>{publicacion.categoria[0]}</Link></p>
                                    </div>


                                </div>


                                <div className="col-md-12 col-lg-4 sidebar">
                                    <div className="sidebar-box search-form-wrap">
                                        <form onSubmit={handleSubmit} className="sidebar-search-form">
                                            <span className="bi-search"></span>
                                            <input type="text" className="form-control" name="titulo" placeholder="Titulo del post y enter" />
                                        </form>
                                    </div>
                                    <div className="sidebar-box">
                                        <div className="bio text-center">
                                            <img src={publicacion.usuario[2] ? URL_API2+publicacion.usuario[2] : "images/perfilUser.png"} alt="Image_placeholder" className="rounded-circle " style={{ "width": "150px", "height": "150px" }} />
                                            <div className="bio-body">
                                                <h2>{publicacion.usuario[1]}</h2>
                                                <h6>ultima edicion: {publicacion.updatedAt.slice(0, 10)}</h6>

                                            </div>
                                        </div>
                                    </div>

                                    <Seccion />
                                </div>

                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <div className="text-center my-3">
                    <div className="text-center spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Post;