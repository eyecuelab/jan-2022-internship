import {
  useActionData,
  useLoaderData,
  ActionFunction,
  LoaderFunction,
  Form,
  json,
} from "remix";
import { db } from "~/utils/db.server";

// importing React icons.
import { BsArrowRight } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";

// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader: LoaderFunction = async () => {
  // Get movies from the movie db API:
  const BASE_URL = "https://api.themoviedb.org/3";
  const rand130 = Math.round(Math.random() * 130);
  const API_URL = `${BASE_URL}/movie/popular?&api_key=${process.env.API_KEY}&vote_average.gte=6.0&vote_count.gte=1000&original_language=en&page=${rand130}`;

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

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const id = form.get("id");
    const actionType = form.get("actionType");

    if (typeof actionType !== "string") {
      throw new Error(`No action type found in form data.`);
    }

    if (typeof id !== "string") {
      throw new Error(`No action type found in form data.`);
    }
  } catch (e) {
    console.error(e);
    return json("Sorry, we couldn't post that", {
      status: 500,
    });
  }
};

export default function Movies() {
  // UseState with a default value of 0.
  const data = useLoaderData();
  const [value, setValue] = useState(0);
  const actionData = useActionData();

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + data[value].posterPath;

  function handleDbUpdateLike() {
    if (value === 0) {
      setValue(data.length - 1);
    } else {
      setValue(value - 1);
    }
  }

  async function handleDbUpdateDisLike() {
    if (value === 0) {
      setValue(data.length - 1);
    } else {
      setValue(value - 1);
    }
  }

  return (
    <>
      <Form method="post">
        <div>
          <input type="hidden" name="actionType" value="1" />
          <input type="hidden" name="id" value={data[value].id}></input>
          <button type="submit" onClick={() => handleDbUpdateLike()}>
            <BsArrowLeft />
            Yes click
          </button>
        </div>
      </Form>
      <Form method="post">
        <div>
          <input type="hidden" name="actionType" value="-1" />
          <input type="hidden" name="id" value={data[value].id}></input>
          <button type="submit" onClick={() => handleDbUpdateDisLike()}>
            <BsArrowRight />
            No click
          </button>
        </div>
      </Form>
      <img src={poster} alt={data[value].posterPath} />
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
