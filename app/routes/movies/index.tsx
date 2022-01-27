import type { Movie } from "@prisma/client";
import type { FC } from "react";
import type { LoaderFunction } from "remix";
import { Link } from "react-router-dom";
import { useLoaderData } from "remix";
import { getMovies, syncMovies } from "~/services/movies";

type LoaderData = { movies: Movie[] };

// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const numberCreated = await syncMovies();
  console.log(`Created ${numberCreated} movies`);

  // Get the newly written movies from the DB and return them to the client:
  const movies = await getMovies();
  return { movies };
};

// This is the react component that renders on the client:
const Movies: FC = () => {
  const { movies } = useLoaderData<LoaderData>();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="container">
      <div className="movies">
        <h1>All Movies</h1>
        <ul>
          {movies.map((movie) => {
            const poster = IMG_URL + movie.posterPath;
            return (
              <Link key={movie.id} to={movie.id}>
                <li>
                  <img src={poster} />
                  <h4>{movie.title}</h4>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Movies;
