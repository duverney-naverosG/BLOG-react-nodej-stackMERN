import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { URL_API } from '../config/URL';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function EditPost() {
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(AuthContext)
    const [searchParams] = useSearchParams()
    const [value, setValue] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [post, setPost] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    }

    const cargarCategorias = async () => {
        const res = await fetch(URL_API + '/categorias');
        const data = await res.json();
        setCategorias(data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        setPost({ ...post, "descripcion": value });
        let postCreate = post;

        if (postCreate.titulo && postCreate.descripcion && postCreate.categoria) {
            if (file !== null) {
                const data = new FormData();
                const filename = Date.now() + file.name;
                data.append("name", filename);
                data.append("file", file);
                postCreate.foto = filename;

                try {
                    const res = await fetch(URL_API + '/upload', {
                        method: 'POST',
                        body: data
                    });

                    if (res.status === 500) {
                        setLoading(false);
                        return Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'el arhivo debe ser una imagen y pesar menos de 35M!'
                        })
                    }

                } catch (err) {
                    toast.error('ERROR INTERNO');
                }
            }

            try {
                const resUser = await fetch(URL_API + '/publicaciones', {
                    method: 'POST',
                    body: JSON.stringify(postCreate),
                    headers: {
                        "Authorization": `Bearer ${currentUser.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (resUser.status === 200) {
                    toast.success('POST REGISTRADO');
                    navigate("/publicaciones");
                }

                if (resUser.status === 505) {
                    toast.error('SESION EXPIRO');
                    logout()
                    navigate('/')
                }

                if (resUser.status === 400) {
                    toast('llenar todos los campos!', {
                        icon: '⚠️',
                    });
                }

                if (resUser.status === 500) {
                    toast.error('ERROR INTERNO');
                }

                if (resUser.status === 502) {
                    toast.error('TOKEN ADULTERADO');
                }

            } catch (err) {
                toast.error('ERROR INTERNO');
            }
        }

        setLoading(false);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setPost({ ...post, "descripcion": value });
        let postCreate = post;

        if (postCreate.titulo && postCreate.descripcion && postCreate.categoria) {
            if (file !== null) {
                const data = new FormData();
                const filename = Date.now() + file.name;
                data.append("name", filename);
                data.append("file", file);
                postCreate.foto = filename;
    
                try {
                    const res = await fetch(URL_API + '/upload', {
                        method: 'POST',
                        body: data
                    });
    
                    if (res.status === 500) {
                        setLoading(false);
                        return Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'el arhivo debe ser una imagen y pesar menos de 35M!'
                        })
                    }
    
                } catch (err) {
                    toast.error('ERROR INTERNO');
                }
            }
    
            try {
                const resUser = await fetch(URL_API + '/publicaciones/' + post._id, {
                    method: 'PUT',
                    body: JSON.stringify(postCreate),
                    headers: {
                        "Authorization": `Bearer ${currentUser.token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (resUser.status === 200) {
                    toast.success('POST ACTUALIZADO');
                    navigate('/publicaciones')
                }
    
                if (resUser.status === 505) {
                    toast.error('SESION EXPIRO');
                    logout()
                    navigate('/')
                }
    
                if (resUser.status === 400) {
                    toast('llenar todos los campos!', {
                        icon: '⚠️',
                    });
                }
    
                if (resUser.status === 500) {
                    toast.error('ERROR');
                }
    
                if (resUser.status === 502) {
                    navigate('/')
                }
    
            } catch (err) {
                toast.error('ERROR INTERNO');
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        cargarCategorias()
    }, []);

    useEffect(() => {
        if (searchParams.get('id') != null) {
            const cargarPublicacion = async () => {
                const res = await fetch(URL_API + '/publicaciones/' + searchParams.get('id'));
                const data = await res.json();
                if (res.status === 500) {
                    toast.error('PUBLICACION NO ENCONTRADA');
                    navigate('/')
                }
                setValue(data.descripcion);
                setPost(data)
            }
            cargarPublicacion()
        }
    }, [navigate, searchParams]);

    return (
        <div>

            <div className="hero overlay inner-page bg-primary py-5">
                <div className="container">
                    <div className="row align-items-center justify-content-center text-center">
                        <div className="col-lg-6">
                            <h1 className="heading text-white mb-3" >PUBLICACION</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">

                    <div className="row blog-entries element-animate">
                        <h3 className='text-dark'>ESCRIBE TU POST</h3>


                        <div className="col-md-12 col-lg-7 main-content">


                            <div className="post-content-body ">
                                <input type="text" className="form-control" placeholder="TITULO" autoFocus autoComplete="off" required name="titulo" value={post.titulo} onChange={handleChange} />
                                <ReactQuill theme="snow" value={value} onChange={setValue} required style={{ "height": " 300px", "overflow": "scroll", "border": "1px solid lightgray" }} />
                                {
                                    searchParams.get('id') != null ? (
                                        <button onClick={handleSubmitEdit} className={loading ? "btn btn-primary disable mt-2" : "btn btn-primary mt-2"}>
                                            {loading ?
                                                <div className="spinner-border text-info" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                : "ACTUALIZAR"
                                            }
                                        </button>
                                    ) : (
                                        <button onClick={handleSubmit} className={loading ? "btn btn-primary disable mt-2" : "btn btn-primary mt-2"}>
                                            {loading ?
                                                <div className="spinner-border text-info" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                : "AGREGAR"
                                            }
                                        </button>
                                    )
                                }

                            </div>
                        </div>

                        <div className="col-md-12 col-lg-5 sidebar">
                            <div className="sidebar-box">
                                <h3 className="heading">SELECIONA IMAGEN</h3>
                                <div className="post-entry-sidebar">
                                    <div className="input-group mb-3">
                                        <input type="file" className="form-control" placeholder="foto" onChange={(e) => setFile(e.target.files[0])} />
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-box">
                                <h3 className="heading">CATEGORIAS</h3>
                                {
                                    categorias.map((categoria, index) => (
                                        <div className="form-check" key={index}>
                                            {
                                                searchParams.get('id') != null ? (
                                                    post.categoria && (post.categoria[0] === categoria.nombre ? (
                                                        <div>
                                                            <input className="form-check-input" type="radio" name="categoria" value={categoria.nombre} onChange={handleChange} checked={true} required />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                {categoria.nombre}
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <input className="form-check-input" type="radio" name="categoria" value={categoria.nombre} onChange={handleChange} required />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                {categoria.nombre}
                                                            </label>
                                                        </div>
                                                    ))

                                                ) : (
                                                    <div>
                                                        <input className="form-check-input" type="radio" name="categoria" value={categoria.nombre} onChange={handleChange} required />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            {categoria.nombre}
                                                        </label>
                                                    </div>
                                                )

                                            }

                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default EditPost;