import { useLoaderData } from "remix";
import globalStylesUrl from "~/styles/global.css";

console.log(process.env.NODE_ENV);
export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

const IMG_URL = "https://image.tmdb.org/t/p/w500";

export async function loader() {
  const API_KEY = process.env.API_KEY;
  console.log(process.env.API_KEY);
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL =
    BASE_URL +
    "/discover/movie?sort_by=popularity.desc&" +
    "api_key=" +
    API_KEY;
  let res = await fetch(API_URL);
  return res.json();
}

export default function showMovies() {
  const list = useLoaderData();
  const movies = list.results;
  console.log(list);
  console.log(movies);

  return (
    <div className="container">
      <div className="movies">
        <h1>All Movies</h1>
        <ul>
          {movies &&
            movies.map((item) => {
              const poster = IMG_URL + item.poster_path;
              return (
                <li key={item.id}>
                  <img src={poster} />
                  <h4>{item.title}</h4>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
