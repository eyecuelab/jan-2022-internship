import { ActionFunction, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requirePlayerId, requireUser } from "~/utils/session.server";
import { usePolling } from "~/hooks";
import players from "~/assets/img/players.png";
import check from "~/assets/img/check.png";
import lobbyStyles from "~/styles/lobby.css";
import back from "~/assets/img/back.png";
import home from "~/assets/img/home.png";
import { Form } from "remix";
import { redirect } from "remix";
import { Key } from "react";

export const links = () => [{ rel: "stylesheet", href: lobbyStyles }];

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;
  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true, tmdbid: true },
    }),
  };

  //get game's unique id and status
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true, isStarted: true },
  });
  if (!game) throw new Error("Game not found");

  //get all players in the game
  const gamePlayers = await db.game.findMany({
    where: { slug },
    select: {
      players: { include: { player: { select: { username: true } } } },
    },
  });

  const playerId = await requirePlayerId(request);
  const adminPlayer = await db.playersInGames.findUnique({
    where: { playerId },
    select: {
      isHost: true,
    },
  });

  const gameStatus = game.isStarted;
  const status = gameStatus;

  //get movie's unique id
  const movie = await db.movie.findUnique({
    where: { id: data.movies[0].id },
  });
  if (!movie) throw new Error("Movie not found");

  //get current user
  const player = await requireUser(request);

  //get all users playing the game
  const {
    0: {
      players: { ...playersObj },
    },
  } = gamePlayers;

  const playersArr = Object.values(playersObj);

  const gameId = game.id;
  const startTheGame = await db.game.findUnique({
    where: { id: gameId },
    select: { isKickedOff: true },
  });

  const isAdminHost = adminPlayer?.isHost;
  const gameKickedOff = startTheGame?.isKickedOff;

  if (isAdminHost === false && gameKickedOff === true) {
    return redirect(`/game/${slug}/${data.movies[0].id}`);
  }

  return {
    data,
    player,
    slug,
    playersArr,
    status,
    gameId,
    isAdminHost,
    gameKickedOff,
  };
};

export const action: ActionFunction = async ({ params }) => {
  const slug = params.code;
  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true, tmdbid: true },
    }),
  };

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true, isStarted: true },
  });

  if (!game) throw new Error("Game not found");

  const gameId = game.id;

  await db.game.update({
    where: { id: gameId },
    data: { isKickedOff: true },
  });

  return redirect(`/game/${slug}/${data.movies[0].id}`);
};

export default function Lobby() {
  const { slug } = useLoaderData();

  //  const { slug } = useParams();
  const { playersArr, isAdminHost } = usePolling(
    `/game/${slug}/lobby`,
    useLoaderData(),
    1000
  );

  let button;
  if (isAdminHost === true) {
    button = <button className="btn-lobby glow-button">Begin Game</button>;
  } else {
    button = (
      <button disabled className="btn-lobby glow-button">
        Wait for admin...
      </button>
    );
  }

  return (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col1">
            <Link to={`/game/${slug}/share`}>
              <img src={back} alt="back button" />
            </Link>
          </div>
          <div className="col2">
            <Link to="/">
              <img src={home} alt="home button" />
            </Link>
          </div>
        </div>
        <img src={players} alt="players icon" />
        <h2>Your Friends</h2>
        <p>These are the people you’re going to watch it with.</p>
      </div>
      <div className="wrapper">
        <div className="container">
          <div className="list-item">
            <ul>
              {playersArr.map(
                (
                  player: { playerId: Key | null | undefined },
                  i: string | number
                ) => (
                  <li
                    key={player.playerId}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <img src={check} alt="check mark" />
                    {playersArr[i].player.username}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      <div id="footer">
        <Form method="post">{button}</Form>
      </div>
    </>
  );
}
