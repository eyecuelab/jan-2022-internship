import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
    }),

    games: await db.game.findMany({
      take: 2,
      select: { id: true, slug: true },
    }),
  };

  console.log(data);

  return data;
};

export default function Lobby() {
  const { ...data } = useLoaderData();
  const code = data.games[0].slug;
  //const movies = data.movies;

  return <div>
    <h3>You are: 'username'</h3>
    <h3>Wait for everyone to join!</h3>
    <h4><Link to={`/game/${code}/play`}>Start the game</Link></h4>
  </div>;
}
