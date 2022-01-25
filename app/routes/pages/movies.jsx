import { useLoaderData } from "remix";
import globalStylesUrl from "~/styles/global.css";
import dotenv from "dotenv";

const { API_KEY } = process.env;
dotenv.config();

//const API_KEY = process.env.API_KEY;

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

//test GET call
//https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1d9944a4a4203e26b1afea650af413a0

//const API_KEY = "1d9944a4a4203e26b1afea650af413a0";
console.log(API_KEY);
//console.log(process.env["NODE_ENV"]);

const BASE_URL = "https://api.themoviedb.org/3";
const API_URL =
  BASE_URL + "/discover/movie?sort_by=popularity.desc&" + "api_key=" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export async function loader() {
  let res = await fetch(API_URL);
  return res.json();
}

export default function showMovies() {
  const list = useLoaderData();
  const movies = list.results;

  console.log(movies);

  return (
    <div className="container">
      <div className="movies">
        <h1>All Movies</h1>
        {/* <div key={movies.results.id}>{list}</div> */}
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
