import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import Game from "~/routes/game";
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
  const gameId = game.id;
  console.log(gameId);

  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });
  if (!movie) throw new Error("Movie not found");

  console.log(game);
  const player = await getPlayer(request);

  const movieId = movie.id;

  // const createMovieScore = await db.movieScore.create({
  //   data: {
  //     movieId,
  //     gameId,
  //     likes: 0,
  //     dislikes: 0,
  //   },
  // });

  return { movie, player, game };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (typeof actionType !== "string") {
    return redirect("/login");
  }

  // const updateTaste = await db.game.create({
  //   where: { id: score.game },
  //   data: {
  //     MovieScore: {},
  //   },
  // });

  //const data = { updateTaste };
  //console.log(params);
  //return redirect(`$movieId`);
  //return data;
  return null;
};

// export const loader: LoaderFunction = async ({ params }) => {
//   const movie = await db.movie.findUnique({
//     where: { id: params.movieId },
//   });
//   if (!movie) throw new Error("Movie not found");
//   const data = { movie };
//   return data;
// };

export default function Movie() {
  const { movie } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();

  return (
    <div>
      <div className="page-header">
        <Link to="/movies">Back</Link>
        {movie.id && (
          <>
            <form method="post">
              <input type="hidden" name="actionType" value="1" />
              <button type="submit">Yes</button>
            </form>
            <form method="post">
              <input type="hidden" name="actionType" value="-1" />
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
