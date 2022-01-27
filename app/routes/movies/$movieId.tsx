import { Link, redirect, useActionData, useLoaderData } from "remix"
import { db } from "~/utils/db.server";

export async function action({ request, params }) {
  const formData = await request.formData();
  let value = Object.fromEntries(formData)
  return value;
}

// export async function updateDB(){
//     const params = useLoaderData()
//     const value = useActionData();
//     const updatedTaste = await db.movie.update({
//     where: { id: params.movieId },
//     data: { tasteProfile: value}
//   })

//   if (!value) throw new Error('No input was provided')
//   const data = { updatedTaste }
//   console.log(data);
//   redirect(`/movies/`);
//   return updatedTaste;
//  }

export const loader = async ({ params }) => {
  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  })
  if (!movie) throw new Error('Movie not found')
  const data = { movie }
  return data

}

export default function Movie() {
  const { movie } = useLoaderData()
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();
  console.log(vote);
  //updateDB();

  return (
    <div>
      <div className='page-header'>
        <Link to='/movies'>
          Back
        </Link>
        {movie.id && (
          <>
            <form method='post'>
              <input type='hidden' name='actionType' value='true' />
              <button type="submit">Yes</button>
            </form >
            <form method='post'>
              <input type='hidden' name='actionType' value='false' />
              <button type="submit">No</button>
            </form >
          </>
        )}
        <div>
          <h1>{movie.title}</h1>
          <h3>{movie.id}</h3>
          <img src={poster} />
        </div>
      </div>
    </div>
  )
}
