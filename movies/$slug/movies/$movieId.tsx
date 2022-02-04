import { useLoaderData, Link, redirect } from "remix";
import { db } from "~/utils/db.server";
import { getPlayer } from "~/utils/session.server";

export const loader = async ({ request, params }) => {
  const user = await getPlayer(request);

  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });

  if (!movie) throw new Error("Movie not found");

  const data = { movie };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getPlayer(request);

    const movie = await db.movie.findUnique({
      where: { id: params.movieId },
    });

    if (!movie) throw new Error("Movie was not found");

    // if (user && movie.playerId === user.id) {
    //   await db.movie.delete({ where: { id: params.movieId } });
    // }

    return redirect("/game");
  }
};

export default function Movie() {
  const { movie } = useLoaderData();

  return (
    <div>
      <div>
        <h1>{movie.title}</h1>
        <Link to="/games">
          Back
        </Link>
        <br />
        <Link to={`/game/1b76e985-074a-497b-bee0-46f7581b1d66`}>
          Next
        </Link>
      </div>
    </div>
  );
}


