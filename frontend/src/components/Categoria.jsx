function Categoria({precio, eliminar}) {
    return (
        <tr>
            <th scope="row">{precio._id}</th>
            <td>{precio.nombre}</td>
            <td className="p-0 m-0 text-center">
                <button type="button" onClick={()=> eliminar(precio._id)} className="btn btn-danger ms-1">eliminar</button>
            </td>
        </tr>
    );
}

export default Categoria;