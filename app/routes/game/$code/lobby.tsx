import { ActionFunction, Link, useLoaderData } from "remix";
import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader: ActionFunction = async ({ request, params }) => {
  const slug = params.code;
  const data = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
    }),
  };

  //get all players in the game
  const gamePlayers = await db.game.findMany({
    where: { slug },
    select: {
      players: { include: { player: { select: { username: true } } } },
    },
  });

  //get game's unique id
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!game) throw new Error("Game not found");
  const gameId = game.id;

  //get movie's unique id
  const movie = await db.movie.findUnique({
    where: { id: data.movies[0].id },
  });
  if (!movie) throw new Error("Movie not found");

  //const movieId = data.movies[1].id;

  const movieObj = await db.movie.findMany({
    select: { id: true },
  });

  const allMovies = movieObj.map((item) => {
    return item.id;
  });

  //insert all movies in MovieScore table
  allMovies.map(async (item) => {
    await db.movieScore.create({
      data: {
        movieId: item,
        gameId,
        likes: 0,
        dislikes: 0,
      },
    });
  });

  //get current user
  const player = await requireUser(request);

  //get all users playing the game
  const {
    0: {
      players: { ...playersObj },
    },
  } = gamePlayers;
  const playersArr = Object.values(playersObj);

  return { data, player, slug, playersArr };
};

export default function Lobby() {
  const { data, player, slug, playersArr } = useLoaderData();
  //console.log(data.movies[0].id);

  return (
    <div>
      <pre>Game ID is: {slug}</pre>
      <pre>You are: {player.username}</pre>
      <br />
      <pre>Wait for everyone to join!</pre>
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
      <Link to={`/game/${slug}/${data.movies[0].id}`}>Lets GO</Link>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
function movieIdArr(movieIdArr: any) {
  throw new Error("Function not implemented.");
}
