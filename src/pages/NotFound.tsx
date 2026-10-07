import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-muted">
    <Helmet>
      <title>Página no encontrada | SantoSha</title>
      <meta name="robots" content="noindex,follow" />
    </Helmet>
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-4 text-xl text-muted-foreground">Página no encontrada</p>
      <Link to="/" className="text-primary underline hover:text-primary/90">Volver al inicio</Link>
    </div>
  </div>
);

export default NotFound;
