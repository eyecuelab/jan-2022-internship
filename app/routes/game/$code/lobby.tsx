import { ActionFunction, json, Link, useLoaderData } from "remix";
import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader: ActionFunction = async ({ request, params }) => {
  const slug = params.code;
  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true },
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
  //const movieId = movie.id;

  const movieObj = await db.movie.findMany({
    select: { id: true },
  });

  const allMovies = movieObj.map((item) => {
    return item.id;
  });

  if (!status) {
    //insert all movies in MovieScore table
    allMovies.map(async (item, i) => {
      await db.movieScore.create({
        data: {
          //movie: { connect: { id: movieId } },
          movieId: item,
          position: i + 1,
          gameId,
          likes: 0,
          dislikes: 0,
        },
        include: { movie: true },
      });
    });

    //const gameId = game.id;
    await db.game.update({
      where: { id: gameId },
      data: { isStarted: true },
    });
  } else {
    if (!allMovies) {
      throw json("Movies already added.", 404);
    }
  }

  //get current user
  const player = await requireUser(request);

  //get all users playing the game
  const {
    0: {
      players: { ...playersObj },
    },
  } = gamePlayers;
  const playersArr = Object.values(playersObj);

  // ======================

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

  console.log(movieList.movies);

  // const movieQueue = await db.movieScore.findMany({
  //   where: {
  //     game: { id: game.id },
  //     AND: [
  //       {
  //         movie: { id: params.movieId },
  //       },
  //     ],
  //   },
  // });

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

  // ======================

  return { data, player, slug, playersArr, status };
};

export default function Lobby() {
  const { data, player, slug, playersArr, status } = useLoaderData();

  return (
    <div>
      <pre>Game ID is: {slug}</pre>
      <pre>You are: {player.username}</pre>
      <br />
      <pre>Wait for everyone to join!</pre>
      <br />
      <pre>Game started? : {`${status}`}</pre>
      <br />
      <pre>Players in the room: </pre>
      <ul>
        {playersArr.map((player, i) => (
          <li key={player.playerId}>
            <pre>{playersArr[i].player.username}</pre>
          </li>
        ))}
      </ul>
      <br />
      {/* <Link to={`/game/${slug}/${data.movies[0].id}`}>Lets GO</Link> */}
      <Link to={`/game/${slug}/${data.movies[0].id}`}>Lets GO</Link>
    </div>
  );
}

//   return (
//     <div className="error-container">
//       <pre>{error.message}</pre>
//     </div>
//   );
// }
// function movieIdArr(movieIdArr: any) {
//   throw new Error("Function not implemented.");
// }
function getAllMovies(): import("react").EffectCallback {
  throw new Error("Function not implemented.");
}
