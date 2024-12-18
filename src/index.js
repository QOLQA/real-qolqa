import "./styles/output.css";
import { renderDiagramaView } from "./features/diagrama/diagramaView";
import { renderSolutionsView } from "./features/solutions/solutionsView";

const matchRoute = (routePattern, path) => {
  const routeParts = routePattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];

    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1);
      params[paramName] = pathPart;
    } else if (routePart !== pathPart) {
      return null;
    }
  }

  return params;
}

// Función de enrutamiento simple
const router = () => {
  const path = window.location.pathname;
  // if (path === '/') {
  //   renderCounterView();
  // } else if (path === '/todo') {
  //   renderTodoView();
  // }
  const routes = [
    {path: '/', view: renderSolutionsView},
    {path: '/diagrama/:id', view: renderDiagramaView},
  ]

  // Buscar la ruta que coincida con el path actual
  for (const route of routes) {
    const params = matchRoute(route.path, path);
    if (params) {
      route.view(params, router);
      return;
    }
  }

  // Si no hay coincidencias, redirigir al home
  window.history.pushState({}, '', '/');
  renderSolutionsView(handleNavigation);

  
};

// Manejar navegación al hacer clic en los enlaces
const handleNavigation = (event) => {
  event.preventDefault(); // Evita la recarga completa de la página
  const href = event.target.getAttribute('href');
  window.history.pushState({}, '', href); // Cambia la URL sin recargar la página
  router(); // Renderiza la vista correspondiente
};

window.addEventListener('popstate', router);

router();
