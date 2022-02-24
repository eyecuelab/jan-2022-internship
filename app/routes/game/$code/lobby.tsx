import {
  ActionFunction,
  json,
  Link,
  NavLink,
  useLoaderData,
  useParams,
} from "remix";
import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";
import { usePolling } from "~/hooks";
import players from "~/assets/img/players.png";
import check from "~/assets/img/check.png";
import lobbyStyles from "~/styles/lobby.css";
import back from "~/assets/img/back.png";
import home from "~/assets/img/home.png";

export const links = () => [{ rel: "stylesheet", href: lobbyStyles }];

export const loader: ActionFunction = async ({ request, params }) => {
  const slug = params.code;
  //const { slug } = params;
  console.log(slug);

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

  const gameId = game.id;
  const gameStatus = game.isStarted;
  const status = gameStatus;
  console.log(status);

  //get movie's unique id
  const movie = await db.movie.findUnique({
    where: { id: data.movies[0].id },
  });
  if (!movie) throw new Error("Movie not found");

  const movieObj = await db.movie.findMany({
    select: { id: true, title: true, tmdbid: true },
  });

  const allMovies = movieObj.map((item) => {
    return item;
  });

  // const allTmdbIds = movieObj.map((item) => {
  //   console.log(item.tmdbid);
  //   return item.tmdbid;
  // });

  //console.log(allMovies[0].tmdbid);

  // if (!status) {
  //   //insert all movies in MovieScore table
  //   allMovies.map(async (item, i) => {
  //     await db.movieScore.create({
  //       data: {
  //         //movie: { connect: { id: movieId } },
  //         movieId: item.id,
  //         tmdb: item.tmdbid,
  //         position: i + 1,
  //         gameId,
  //         likes: 0,
  //         dislikes: 0,
  //       },
  //       include: { movie: true },
  //     });
  //   });

  //   //const gameId = game.id;
  //   await db.game.update({
  //     where: { id: gameId },
  //     data: { isStarted: true },
  //   });
  // } else {
  //   if (!allMovies) {
  //     throw json("Movies already added.", 404);
  //   }
  // }

  //get current user
  const player = await requireUser(request);

  //get all users playing the game
  const {
    0: {
      players: { ...playersObj },
    },
  } = gamePlayers;
  const playersArr = Object.values(playersObj);

  //get ordered list of movies
  const movieList = {
    movies: await db.movieScore.findMany({
      where: { game },
      select: { id: true, position: true },
      orderBy: {
        position: "asc",
      },
    }),
  };

  const movieQueue = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  console.log("current movie position:");
  console.log(movieQueue[0].position);

  return { data, player, slug, playersArr, status };
};

export default function Lobby() {
  const { slug } = useLoaderData();
  //  const { slug } = useParams();
  const { data, player, playersArr, status } = usePolling<LoaderData>(
    `/game/${slug}/lobby`,
    useLoaderData<LoaderData>(),
    1000
  );

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
              {playersArr.map((player, i) => (
                <li
                  key={player.playerId}
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <img src={check} alt="check mark" />
                  {playersArr[i].player.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div id="footer">
        <NavLink to={`/game/${slug}/${data.movies[0].id}`}>
          <button className="btn-lobby glow-button">Begin Game</button>
        </NavLink>
      </div>
    </>
  );
}
