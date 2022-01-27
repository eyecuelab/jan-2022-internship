import type { Movie } from "@prisma/client";
import type { FC } from "react";
import type { ActionFunction, LoaderFunction } from "remix";
import { Link, useActionData, useLoaderData } from "remix";
import { getMovie, updateTasteProfile } from "~/services/movies";

enum ActionTypes {
  Like = "like",
  Dislike = "dislike",
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  if (typeof actionType !== "string") {
    throw new Response("Invalid action type", { status: 400 });
  }
  if (!params.movieId) {
    throw new Response("Invalid movie id", { status: 400 });
  }

  switch (actionType) {
    case ActionTypes.Like:
      return updateTasteProfile(params.movieId, true);
    case ActionTypes.Dislike:
      return updateTasteProfile(params.movieId, false);
    default:
      throw new Response("Invalid action type", { status: 400 });
  }
};

type LoaderData = { movie: Movie };

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  if (!params.movieId) {
    throw new Response("Bad Request", { status: 400 });
  }
  const movie = await getMovie(params.movieId);

  const data: LoaderData = { movie };

  return data;
};

const Movie: FC = () => {
  const { movie } = useLoaderData<LoaderData>();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();
  console.log(vote);

  return (
    <div>
      <div className="page-header">
        <Link to="/movies">Back</Link>
        {movie.id && (
          <>
            <form method="post">
              <input type="hidden" name="actionType" value={ActionTypes.Like} />
              <button type="submit">Yes</button>
            </form>
            <form method="post">
              <input
                type="hidden"
                name="actionType"
                value={ActionTypes.Dislike}
              />
              <button type="submit">No</button>
            </form>
          </>
        )}
        <div>
          <h1>{movie.title}</h1>
          <h3>{movie.id}</h3>
          <img src={poster} />
        </div>
        <div>
          {vote?.errors ? <p style={{ color: "red" }}>{vote.errors}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Movie;
