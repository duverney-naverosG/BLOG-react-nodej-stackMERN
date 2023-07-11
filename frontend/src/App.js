import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Categoria from "./pages/Categoria";
import EditPost from "./pages/EditPost";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Publicaciones from "./pages/Publicaciones";
import Register from "./pages/Register";
import Resultado from "./pages/Resultados";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Post from "./pages/Post";
import ProtectedRouter from "./components/ProtectedRouter";
import ProtectedRouterAdmin from "./components/ProtectedRouterAdmin";
import GestorCategoria from "./pages/GestorCategoria";

function App() {
  return (
    <div>
      <Toaster  position="bottom-left" reverseOrder={false}/>
      <Menu/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Post' element={<Post />} />
        <Route path='/categoria' element={<Categoria />} />
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Resultado />} />
        <Route path='/registro' element={<Register />} />

        <Route element={<ProtectedRouter/>}>
          <Route path='/EditPost' element={<EditPost />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/Publicaciones' element={<Publicaciones />} />
        </Route>

        <Route element={<ProtectedRouterAdmin/>}>
          <Route path='/categorias' element={<GestorCategoria />} />
        </Route>
        
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
