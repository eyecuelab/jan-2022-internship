import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import { getPlayer, requirePlayerId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  //const { slug } = request;
  const data = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
    }),
    // games: await db.game.findMany({
    //   take: 2,
    //   select: { id: true, slug: true },
    // }),
  };

  const player = await getPlayer(request);
  return { data, player };
};

export const action: ActionFunction = async ({ request }) => {
  const playerId = await requirePlayerId(request);
  const game = await createMovieGame({
    playerId,
  });

  return redirect(`/game/${game.slug}/lobby`);
};

export default function index() {
  return (
    <div>
      <Form method="post">
        <>
          {/* <h3>You are {player}</h3> */}
          <input type="hidden" name="loginType" value="begin" />
          <button className="button" type="submit">
            Host New Game
          </button>
        </>
        <br />
        <>
          <input type="hidden" name="loginType" value="join" />
          <button type="submit">
            <Link to="/join">Join game</Link>
          </button>
        </>
      </Form>
    </div>
  );
}
