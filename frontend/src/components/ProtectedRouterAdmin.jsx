import { Navigate, Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

function ProtectedRouter() {
    const { currentUser } = useContext(AuthContext);
    if(currentUser !=null){
        if (currentUser.usuarios.rol === 'admin') {
            return <Outlet />
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'SIN PERMISOS!'
            })
            return <Navigate to={'/'} />
        }
    }else {
        return <Navigate to={'/'} />
    }
    
}

export default ProtectedRouter;