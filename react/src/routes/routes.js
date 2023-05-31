import Home from '../pages/Home';
import FormularioUsuario from '../pages/Users/FormularioUsuario';
import TabelaUsuarios from '../pages/Users/TabeladeUsuarios';
import FormularioCompany from '../pages/Companies/FormularioCompany';
import TodosFuncionariosEmpresa from '../pages/Companies/TodosFuncionariosCompanies';
import TabeladeTreinos from '../pages/Companies/TabeladeCompanies';
import TabelaActions from '../pages/Actions/TabeladeActions';
import FormularioActions from '../pages/Actions/FormularioActions';
import TabeladePerguntas from '../pages/Questions/TabeladePerguntas';
import FormularioPergunta from '../pages/Questions/FormularioPergunta';
import TodasPerguntas from '../pages/Questions/TodasPerguntas';
import { useRoutes } from "react-router-dom";

export const AppRoute = () => {
    let routes = useRoutes([
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/users", element: <TabelaUsuarios /> },
      { path: "/users/formulario", element: <FormularioUsuario /> },
      { path: "/users/formulario/:id", element: <FormularioUsuario /> },
      { path: "/companies", element: <TabeladeTreinos /> },
      { path: "/company/formulario", element: <FormularioCompany /> },
      { path: "/company/formulario/:id", element: <FormularioCompany /> },
      { path: "/company/see-all-employees/:empresa/:id", element: <TodosFuncionariosEmpresa /> },
      { path: "/actions", element: <TabelaActions /> },
      { path: "/action/formulario", element: <FormularioActions /> },
      { path: "/action/formulario/:id", element: <FormularioActions /> },
      { path: "/questions", element: <TabeladePerguntas /> },
      { path: "/question/formulario", element: <FormularioPergunta /> },
      { path: "/question/formulario/:id", element: <FormularioPergunta /> },
      { path: "/questions/allquestions/:id", element: <TodasPerguntas /> },
    ]);
    return routes;
  };