import {
  useActionData,
  useLoaderData,
  ActionFunction,
  redirect,
  LoaderFunction,
  Form,
  json,
} from "remix";
import { db } from "~/utils/db.server";

// importing React icons.
import { BsArrowRight } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";
import { Movie } from "@prisma/client";

// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader: LoaderFunction = async () => {
  // Get movies from the movie db API:
  const BASE_URL = "https://api.themoviedb.org/3";
  //const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}&page=2`;
  const rand50 = Math.round(Math.random() * 50);
  const API_URL = `${BASE_URL}/movie/popular?sort_by=popularity.desc&api_key=${process.env.API_KEY}&page=${rand50}`;

  const res = await fetch(API_URL);
  const moviesFromAPI = await res.json();

  // Delete all movies in db and then write the newly fetched movies to database:
  await db.playersInGames.deleteMany({});
  await db.movieScore.deleteMany({});
  await db.game.deleteMany({});
  await db.user.deleteMany({});
  await db.movie.deleteMany({});
  await db.movie.createMany({
    data: moviesFromAPI.results.map((movie: any) => ({
      title: movie.title,
      tmdbid: String(movie.id),
      overview: movie.overview,
      posterPath: movie.poster_path,
    })),
  });

  // Get the newly written movies from the DB and return them to the client:
  const dbMovies = await db.movie.findMany();
  return dbMovies;
};

export const action: ActionFunction = async ({ request, params }) => {
  const actionType = formData.get("actionType");
  // try {
  //   const form = await request.formData();
  //   const id = form.get("id");
  //   const actionType = form.get("actionType");

  //   if (typeof actionType !== "string") {
  //     throw new Error(`No action type found in form data.`);
  //   }

  //   if (typeof id !== "string") {
  //     throw new Error(`No action type found in form data.`);
  //   }
  // } catch (e) {
  //   console.error(e);
  //   return json("Sorry, we couldn't post that", {
  //     status: 500,
  //   });
  // }

  const slug = params.code;

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  const gameId = game.id;

  switch (actionType) {
    case "1": {
      await db.movieScore.updateMany({
        where: {
          game: { id: gameId },
          AND: [
            {
              movie: { id: params.movieId },
            },
          ],
        },
        data: {
          likes: { increment: 1 },
        },
      });

      const nextMovie = data.movies[nextPosition];
      if (nextMovie === undefined) {
        throw redirect(`/game/${slug}/results`);
      } else {
        throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
      }
    }
    case "no": {
      await db.movieScore.updateMany({
        where: {
          game: { id: gameId },
          AND: [
            {
              movie: { id: params.movieId },
            },
          ],
        },
        data: {
          likes: { increment: -1 },
        },
      });

      const nextMovie = data.movies[nextPosition];
      if (nextMovie === undefined) {
        throw redirect(`/game/${slug}/results`);
      } else {
        throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
      }
    }
    default: {
      throw json("Invalid action type.", 400);
    }
  }
  return null;
};

export default function Movies() {
  // UseState with a default value of 0.
  const movies = useLoaderData<Movie[]>();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const actionData = useActionData();

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movies[currentMovieIndex].posterPath;

  function handleDbUpdateLike() {
    console.log("Yes");
    if (currentMovieIndex === 0) {
      setCurrentMovieIndex(movies.length - 1);
    } else {
      setCurrentMovieIndex(currentMovieIndex - 1);
    }
  }

  async function handleDbUpdateDisLike() {
    console.log("No");
    if (currentMovieIndex === 0) {
      setCurrentMovieIndex(movies.length - 1);
    } else {
      setCurrentMovieIndex(currentMovieIndex - 1);
    }
  }

  return (
    <>
      <Form>
        <div>
          <input type="hidden" name="actionType" value="1" />
          <input
            type="hidden"
            name="id"
            value={movies[currentMovieIndex].id}
          ></input>
          <button type="submit" onClick={() => handleDbUpdateLike()}>
            <BsArrowLeft />
            Yes click
          </button>
        </div>
      </Form>
      <Form>
        <div>
          <input type="hidden" name="actionType" value="-1" />
          <input
            type="hidden"
            name="id"
            value={movies[currentMovieIndex].id}
          ></input>
          <button type="submit" onClick={() => handleDbUpdateDisLike()}>
            <BsArrowRight />
            No click
          </button>
        </div>
      </Form>
      <img src={poster} alt={movies[currentMovieIndex].posterPath} />
      {/* <h2>{data[value].id}</h2>
      <h3>{data[value].title}</h3> */}
      <div>
        {actionData?.errors ? (
          <p style={{ color: "red" }}>{actionData.errors}</p>
        ) : null}
      </div>
    </>
  );
}
