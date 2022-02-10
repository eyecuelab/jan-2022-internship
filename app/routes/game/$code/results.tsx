import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!game) throw new Error("Game not found");
  const gameId = game.id;
  const topSelection = await db.movieScore.findMany({
    take: 5,
    where: {
      game: { id: gameId },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
    orderBy: { likes: "desc" },
  });

  return topSelection;
};

export default function Results() {
  const topSelection = useLoaderData();
  console.log(topSelection);

  return (
    <div>
      <h2>Hooray!!!</h2>
      <h2>Results Page</h2>
      <h3>Top Selection</h3>
      <ul>
        {topSelection.map((item) => (
          <li key={item.id}>
            Movie ID: {item.movieId} - total likes: {item.likes}
          </li>
        ))}
      </ul>
    </div>
  );
}
