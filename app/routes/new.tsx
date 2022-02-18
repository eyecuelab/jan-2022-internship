import { ActionFunction, Form, Link, LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import { getPlayer, requirePlayerId } from "~/utils/session.server";
import banner from "~/assets/svg/banner3.png";
import newStyles from "~/styles/new.css";

export const links = () => [{ rel: "stylesheet", href: newStyles }];

export const loader: LoaderFunction = async ({ request }) => {
  //const { slug } = request;
  // const data = {
  //   movies: await db.movie.findMany({
  //     take: 7,
  //     select: { id: true, title: true },
  //   }),
  // };

  const player = await getPlayer(request);
  return { player };
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

  return redirect(`/game/${game.slug}/share`);
};

export default function New() {
  return (
    <div className="grid-container">
      <div className="item1">
        <img src={banner} className="logo" />
      </div>
      <div className="item2">
        <div className="btns" style={{ marginTop: "40px" }}>
          <Form method="post">
            <>
              {/* <h3>You are {player}</h3> */}
              <input type="hidden" name="loginType" value="begin" />
              <button type="submit" className="btn glow-button">
                Host New Game
              </button>
            </>
            <br />
            <>
              <input type="hidden" name="loginType" value="join" />
              <button type="submit" className="btn glow-button">
                <Link
                  to="/join"
                  className="strip-decor"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  Join Game
                </Link>
              </button>
            </>
          </Form>
        </div>
      </div>
    </div>
  );
}
