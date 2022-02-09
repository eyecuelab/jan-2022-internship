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
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!game) throw new Error("Game not found");

  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });
  if (!movie) throw new Error("Movie not found");

  const movieList = {
    movies: await db.movieScore.findMany({
      where: { game },
      select: { id: true, position: true },
      orderBy: {
        position: "asc",
      },
    }),
  };

  const currMoviePosition = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  console.log("Total number of movies:");
  const totalMoviesNumber = Object.keys(movieList.movies).length;
  console.log(totalMoviesNumber);
  //console.log(movieList.movies);
  console.log("Current movie position:");
  console.log(currMoviePosition[0].position);
  // console.log(currMoviePosition[0]);
  // const nextPosition = currMoviePosition[0].position + 1;
  // console.log("next position");
  // console.log(nextPosition);
  //console.log(Object.keys(movieList.movies).length);

  const player = await getPlayer(request);

  return { movie, player, game, slug, movieList, currMoviePosition };
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

  const currMoviePosition = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  const nextPosition = currMoviePosition[0].position;
  console.log(nextPosition);

  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true },
    }),
  };
  if (!data) throw new Error("Game not found");
  const gameId = game.id;

  if (typeof actionType !== "string") {
    throw new Error(`No action type found in form data.`);
  }

  //should return total number of movies provided in base table - Movies
  //const totalMoviesNumber = Object.keys(data.movies).length;
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
      // throw redirect(`/game/${slug}/${data.movies[1].id}`);
      throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
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
          dislikes: { increment: 1 },
        },
      });
      //throw redirect(`/game/${slug}/${data.movies[2].id}`);
      throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
    }
    default: {
      throw json("Invalid action type.", 400);
    }
  }
};

export default function Movie() {
  const { movie, movieList, slug, currMoviePosition } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();

  //console.log(currMoviePosition[0].position);

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
              <button type="submit">
                No
                {/* <Link to={`/game/${slug}/${movieList.movies[3].id}`}>No</Link> */}
              </button>
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
