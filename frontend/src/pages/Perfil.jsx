import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-hot-toast";
import { URL_API, URL_API2 } from "../config/URL";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Perfil() {

    const navigate = useNavigate();
    const { currentUser, setCurrentUser, logout } = useContext(AuthContext)
    const [user, setUser] = useState(currentUser.usuarios);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let updatedUser = user;

        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            updatedUser.foto = filename;

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

        const res = await fetch(URL_API + '/usuario', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser),
        })

        if (res.status === 200) {
            toast.success('USUARIO ACTUALIZADO');

            const data = await res.json()
            setCurrentUser(data);
        }

        if (res.status === 505) {
            toast.error('SESION EXPIRO');
            setCurrentUser(null)
            navigate('/')
        }

        if (res.status === 400) {
            toast('llenar todos los campos!', {
                icon: '⚠️',
            });
        }

        if (res.status === 502) {
            toast.error('TOKEN ADULTERADO');
        }


        setLoading(false);

    };

    const handleEliminar = () => {
        Swal.fire({
            title: 'DESEA ELIMAR TU PERFIL?',
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

    const eliminar = async() =>{
        const res = await fetch(URL_API + '/usuario', {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            },
        });

        if (res.status === 200) {
            setCurrentUser(null)
            toast.success('USUARIO ELIMINADO');
            navigate("/");
        }

        if (res.status === 502) {
            logout()
        }

        if (res.status === 500) {
            toast.error('ERROR INTERNO 1');
        }
    }


    return (
        <div>
            <div className="hero overlay inner-page bg-primary py-2">
                <div className="container">
                    <div className="row align-items-center justify-content-center text-center pt-5">
                        <div className="col-lg-6">
                            <h1 className="heading text-white mb-3" >PERFIL</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mx-auto" >
                            <div className="text-center mb-2">
                                {
                                    file ? (<img src={URL.createObjectURL(file)} alt="ImagePlaceholder" className="rounded-circle " style={{ "width": "200px", "height": "200px" }} />) 
                                    : 
                                    (<img src={user.foto? URL_API2+user.foto : "images/perfilUser.png"} alt="ImagePlaceholder" className="rounded-circle " style={{ "width": "200px", "height": "200px" }} />)   
                                }
                                
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-3 mt-2">
                                        <input type="file" className="form-control" placeholder="foto" onChange={(e) => setFile(e.target.files[0])} />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" className="form-control" placeholder="NOMBRE" autoFocus autoComplete="off" required name="nombre" onChange={handleChange} value={user.nombre} />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" className="form-control" placeholder="NOMBRE DE USUARIO" autoComplete="off" required name="username" onChange={handleChange} value={user.username} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="email" className="form-control" placeholder="CORREO" autoComplete="off" required name="correo" onChange={handleChange} value={user.correo} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="number" className="form-control" placeholder="TELEFONO" autoComplete="off" required name="telefono" onChange={handleChange} value={user.telefono} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="password" className="form-control" placeholder="NUEVA CONTRASEÑA" autoComplete="off" name="passwordM" onChange={handleChange} />
                                    </div>

                                    <div className="col-6">
                                        {(loading) ?
                                            (<button className="btn btn-primary" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="visually-hidden">Loading...</span>
                                            </button>)
                                            :
                                            (<input type="submit" value="ACTUALIZAR" className={"btn btn-primary"} />)
                                        }
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-danger" onClick={handleEliminar} type="button" >
                                            ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;