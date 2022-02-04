import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
    }),

    games: await db.game.findMany({
      take: 2,
      select: { id: true, slug: true },
    }),
  };

  console.log(data);

  return data;
};

export default function DisplayMovies() {
  const { ...data } = useLoaderData();
  const code = data.games[0].slug;
  const movies = data.movies;

  return (
    <>
      <div>
        <h3>Game token - {code} - Share it with friends.</h3>
      </div>

      <div className="page-header">
        <h1>Movies</h1>
        <Link to={`/games/${code}`}>
          The Game is On
        </Link>
      </div>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/games/${code}/movies/${movie.id}`}>
              <h3>{movie.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
