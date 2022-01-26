import { Link } from "react-router-dom";
import { useLoaderData } from "remix";
//import { getMovies } from "~/api/getmovies";
import { db } from "~/utils/db.server";

// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader = async () => {
  // Get movies from the movie db API:
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}`;
  
  const res = await fetch(API_URL);
  const moviesFromAPI = await res.json();
  // const movies = await getMovies();
  // const moviesFromAPI = movies.results;

  // Delete all movies in db and then write the newly fetched movies to database:
  await db.movie.deleteMany({});
  await db.movie.createMany({
    data: moviesFromAPI.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
    })),
  });

  // Get the newly written movies from the DB and return them to the client:
  const dbMovies = await db.movie.findMany();
  return dbMovies;
};

// This is the react component that renders on the client:
export default function Movies() {
  const movies = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="container">
      <div className="movies">
        <h1>All Movies</h1>
        <ul>
          {movies &&
            movies.map((movie: any) => {
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
}
