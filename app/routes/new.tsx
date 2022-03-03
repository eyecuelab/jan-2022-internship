import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useCatch,
} from "remix";
import { createMovieGame } from "~/utils/movieGame.server";
import { getPlayer, requirePlayerId } from "~/utils/session.server";
import banner from "~/assets/svg/banner3.png";
import newStyles from "~/styles/new.css";

export const links = () => [{ rel: "stylesheet", href: newStyles }];

export const loader: LoaderFunction = async ({ request }) => {
  const player = await getPlayer(request);
  return { player };
};

export const action: ActionFunction = async ({ request }) => {
  const playerId = await requirePlayerId(request);
  const game = await createMovieGame({
    playerId,
  });

  if (!game) {
    throw new Response(`No game found for slug: ${slug}`, {
      status: 404,
    });
  } else {
    return redirect(`/game/${game.slug}/share`);
  }
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

export function CatchBoundary() {
  const caught = useCatch();
  console.log(caught);

  return (
    <html>
      <head>
        <title>Oops!</title>
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </body>
    </html>
  );
}
