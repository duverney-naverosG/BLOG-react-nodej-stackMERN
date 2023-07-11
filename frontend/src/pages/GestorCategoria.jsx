import { useEffect, useState } from "react";
import { URL_API } from "../config/URL";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Categoria from "../components/Categoria";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function GestorCategoria() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    const [categoria, setCategoria] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const cargarCategorias = async () => {
        const res = await fetch(URL_API + '/categorias');
        const data = await res.json();
        setCategorias(data);
    }

    const eliminar = async (id) => {
        const res = await fetch(URL_API + `/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 200) {
            toast.success('categoria eliminada')
        }

        if (res.status === 505) {
            toast.error('SESION EXPIRO');
            setCurrentUser(null)
            navigate('/')
        }

        if (res.status === 503) {
            toast('sin permisos!', {
                icon: '⚠️',
            });
            setCurrentUser(null)
            navigate('/')
        }

        if (res.status === 502) {
            toast.error('TOKEN ADULTERADO');
        }

        if (res.status === 500) {
            toast.error('ERROR')
        }
        cargarCategorias()
    }

    //HADLES 
    const hadleChange = (e) => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value });
    }

    const hadleSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();

        const res = await fetch(URL_API + '/categorias', {
            method: 'POST',
            body: JSON.stringify(categoria),
            headers: {
                "Authorization": `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            },
        });

        if (res.status === 500) {
            toast.error('ERROR')
        }

        if (res.status === 200) {
            toast.success('categoria agregada')
            e.target.reset()
            hadleLimpiar()
        }

        if (res.status === 400) {
            toast('llenar todos los campos!', {
                icon: '⚠️',
            });
        }

        if (res.status === 505) {
            toast.error('SESION EXPIRO');
            setCurrentUser(null)
            navigate('/')
        }

        if (res.status === 503) {
            toast('sin permisos!', {
                icon: '⚠️',
            });
            setCurrentUser(null)
            navigate('/')
        }

        if (res.status === 502) {
            toast.error('TOKEN ADULTERADO');
        }

        setLoading(false)
        cargarCategorias()

    }

    const hadleEliminar = async (id) => {
        Swal.fire({
            title: 'Esta seguro de eliminar?',
            text: "accion irrevesible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si, eliminar!'

        }).then((result) => {
            if (result.isConfirmed) {
                eliminar(id);
            }
        })
    }

    const hadleLimpiar = () => {
        setCategoria({});
    }

    useEffect(()=>{
        cargarCategorias()
    }, []);

    return (
        <div className="row mt-2 mb-5">
            <h2 className="text-center mb-3 mt-2">LISTADO DE CATEGORIAS</h2>
            <div className="col-lg-8 ms-2">
                <table className="table text-center" >
                    <thead >
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">NOMBRE</th>
                            <th scope="col" className="p-1 m-1">ACCION</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            categorias.map((precio, index) => (
                                <Categoria key={index} precio={precio} eliminar={hadleEliminar} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="col-lg-3 ms-1  mb-5">
                <h4 className="text-center">AGREGAR UNA CATEGORIA</h4>
                <form onSubmit={hadleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">MOMBRE CATEGORIA</label>
                        <input type="text" className="form-control" autoComplete='off' autoFocus required onChange={hadleChange} name="nombre" />
                    </div>
                    <div >
                        <button type="submit" className={loading ? "btn btn-outline-success disable" : "btn btn-outline-success"}>
                            {loading ?
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                : "agregar"
                            }
                        </button>
                        <button type="reset" onClick={() => hadleLimpiar()} className="btn btn-outline-warning" >Limpiar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GestorCategoria;