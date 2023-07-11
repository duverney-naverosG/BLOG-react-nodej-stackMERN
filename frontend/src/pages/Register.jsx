import Swal from 'sweetalert2'
import toast from 'react-hot-toast';
import { useState } from "react";
import { URL_API } from '../config/URL';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let updatedUser = user;

        if (file !== null) {
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

        try {
            const resUser = await fetch(URL_API + '/register/usuarios/', {
                method: 'POST',
                body: JSON.stringify(updatedUser),
                headers: { 'Content-Type': 'application/json' }
            });

            if (resUser.status === 200) {
                toast.success('USUARIO REGISTRADO');
                navigate("/login");
            }

            if (resUser.status === 400) {
                toast('nombre de usuario registrado!', {
                    icon: '⚠️',
                });
            }

            if (resUser.status === 404) {
                toast('llenar todos los campos!', {
                    icon: '⚠️',
                });
            }

            if (resUser.status === 500) {
                toast.error('ERROR INTERNO');
            }

        } catch (err) {
            toast.error('ERROR INTERNO');
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="hero overlay inner-page bg-primary py-5">
                <div className="container">
                    <div className="row align-items-center justify-content-center text-center">
                        <div className="col-lg-6">
                            <h1 className="heading text-white mb-3" >REGISTRO</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div >
                <div className="mx-3 mt-2 mb-5">
                    <div className="row">
                        <div className="col-lg-6 mx-auto" >
                            <div className="text-center mb-2">
                                <img src={file ? URL.createObjectURL(file) : "images/perfilUser.png"} alt="ImagePlaceholder" className="rounded-circle " style={{ "width": "200px", "height": "200px" }} />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-3 mt-2">
                                        <input type="file" className="form-control" placeholder="foto" onChange={(e) => setFile(e.target.files[0])} />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" className="form-control" placeholder="NOMBRE" autoFocus autoComplete="off" required name="nombre" onChange={handleChange} />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" className="form-control" placeholder="NOMBRE DE USUARIO" autoComplete="off" required name="username" onChange={handleChange} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="email" className="form-control" placeholder="CORREO" autoComplete="off" required name="correo" onChange={handleChange} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="number" className="form-control" placeholder="TELEFONO" autoComplete="off" required name="telefono" onChange={handleChange} />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="password" className="form-control" placeholder="CONTRASEÑA" autoComplete="off" required name="password" onChange={handleChange} />
                                    </div>

                                    <div className="col-6">
                                        <button type="submit" className={loading ? "btn btn-primary disable" : "btn btn-primary"}>
                                            {loading ?
                                                <div className="spinner-border text-info" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                : "REGISTRARSE"
                                            }
                                        </button>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <Link to="/login">ya tienes un cuenta?</Link>
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

export default Register;