import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
//import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { getPlayer } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;
  console.log(slug);

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!game) throw new Error("Game not found");
  //const gameId = game.id;

  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });
  if (!movie) throw new Error("Movie not found");

  const player = await getPlayer(request);

  return { movie, player, game };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const slug = params.code;

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!game) throw new Error("Game not found");
  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true },
    }),
  };
  const gameId = game.id;

  if (typeof actionType !== "string") {
    throw new Error(`No action type found in form data.`);
  }

  switch (actionType) {
    case "yes": {
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
      throw redirect(`/game/${slug}/${data.movies[1].id}`);
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
          likes: { decrement: 1 },
        },
      });
      throw redirect(`/game/${slug}/${data.movies[2].id}`);
    }
    default: {
      throw json("Invalid action type.", 400);
    }
  }
};

export default function Movie() {
  const { movie } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();

  return (
    <div>
      <div className="page-header">
        <Link to="/">Back</Link>
        {movie.id && (
          <>
            <form method="post">
              <input type="hidden" name="actionType" value="yes" />
              <button type="submit">Yes</button>
            </form>
            <form method="post">
              <input type="hidden" name="actionType" value="no" />
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
}
