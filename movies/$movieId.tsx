import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (typeof actionType !== "string") {
    return redirect("/login");
  }

  const updatedTaste = await db.movie.update({
    where: { id: params.movieId },
    data: {
      tasteProfile: { increment: parseInt({ actionType }) },
    },
  });

  const data = { updatedTaste };
  console.log(params);
  //return redirect(`$movieId`);
  return data;
};

export const loader: LoaderFunction = async ({ params }) => {
  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });
  if (!movie) throw new Error("Movie not found");
  const data = { movie };
  return data;
};

export default function Movie() {
  const { movie } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();
  //console.log(vote);

  return (
    <div>
      <div className="page-header">
        <Link to="/movies">Back</Link>
        {movie.id && (
          <>
            <form method="post">
              <input type="hidden" name="actionType" value="1" />
              <button type="submit">Yes</button>
            </form>
            <form method="post">
              <input type="hidden" name="actionType" value="-1" />
              <button type="submit">No</button>
            </form>
          </>
        )}
        <div>
          <h1>{movie.title}</h1>
          <h3>{movie.id}</h3>
          <img src={poster} />
        </div>
        <div>
          {vote?.errors ? <p style={{ color: "red" }}>{vote.errors}</p> : null}
        </div>
      </div>
    </div>
  );
}
