import { useLoaderData, Link } from "remix";
import globalStylesUrl from "~/styles/global.css";
import { writeToDB } from "./movies.server";
//import * as dotenv from "dotenv";

//console.log(process.env.NODE_ENV);
export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

const IMG_URL = "https://image.tmdb.org/t/p/w500";

export async function loader() {
  //dotenv.config();
  //const API_KEY = process.env.API_KEY;
  console.log(API_KEY);
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL =
    BASE_URL + "/discover/movie?sort_by=popularity.desc&api_key=" + API_KEY;
  let res = await fetch(API_URL);
  return res.json();
}

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// async function writeToDB() {
//   const data = useLoaderData();
//   console.log(data.results);

//   const movieTitle = data.results.title;

//   await prisma.movie.create({
//     data: {
//       id: data.id,
//       title: "Scary Movie",
//       plot: "Scary Plot",
//       // title: movieTitle,
//       // plot: data.overview,

//       //id: id,
//       // title: "New Movie",
//       // plot: "New Plot",
//     },
//   });
// }

export default function showMovies() {
  const list = useLoaderData();
  const movies = list.results;
  writeToDB();

  return (
    <div className="container">
      <div className="movies">
        <h1>All Movies</h1>
        <div>
          <Link to="/pages/moviesdb">Back to Movies from DB</Link>
        </div>
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
