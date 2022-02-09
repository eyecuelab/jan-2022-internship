import { ActionFunction, Form, Link, LoaderFunction, redirect } from "remix";
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
  };

  const player = await getPlayer(request);
  return { data, player };
};

export const action: ActionFunction = async ({ request, params }) => {
  const playerId = await requirePlayerId(request);
  const game = await createMovieGame({
    playerId,
  });

  // const gameId = game.id;

  // const gameStatus = await db.game.update({
  //   where: { id: gameId },
  //   data: { isStarted: true },
  // });

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
