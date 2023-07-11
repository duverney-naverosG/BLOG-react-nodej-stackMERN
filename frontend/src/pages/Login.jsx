import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(user);
            if (res === 200) {
                navigate("/");
                toast.success('SESION EXITOSA!');
            }

            if (res === 400) {
                toast('CREDENCIALES EQUIVOCADAS!', {
                    icon: '⚠️',
                });
            }

            if (res === 404) {
                toast('USUARIO NO REGISTRADO!', {
                    icon: '⚠️',
                });
            }

            if (res === 500) {
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
                    <div className="row align-items-center justify-content-center text-center ">
                        <div className="col-lg-6">
                            <h1 className="heading text-white mb-3" >INICIAR SESION</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div >
                <div className="mx-3 mt-2 mb-5">
                    <div className="row">
                        <div className="col-7 mx-auto">
                            <div className="col-lg-8 m-auto" >
                                <div className="text-center mb-2">
                                    <img src={"images/perfilUser.png"} alt="ImagePlaceholder" className="rounded-circle " style={{ "width": "200px", "height": "200px" }} />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <input type="text" className="form-control" placeholder="NOMBRE DE USUARIO" autoComplete="off" required name="username" onChange={handleChange} />
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
                                                    : "INICIAR SESION"
                                                }
                                            </button>
                                        </div>
                                        <div className="col-6 mt-3">
                                            <Link to="/registro">no tienes una cuenta? crea una!</Link>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;