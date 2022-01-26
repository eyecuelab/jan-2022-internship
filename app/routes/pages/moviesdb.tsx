import { LinksFunction, LoaderFunction } from "remix";
import { Link, Outlet, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import stylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ];
};

type LoaderData = {
  movieListItems: Array<{ id: string; title: string }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    movieListItems: await db.movie.findMany()
  };
  return data;
};

export default function MoviesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <div className="container">
          <h1>
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
            </Link>
          </h1>
        </div>
      </header>
      <main>
        <div className="container">
          <div>
            <Link to="/pages/movies">Pulling form API</Link>
            <ul>
              {data.movieListItems.map(movie => (
                <li key={movie.id}>
                  <Link to={movie.id}>{movie.title}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}