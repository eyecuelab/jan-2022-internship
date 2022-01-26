import { Link, useLoaderData } from "remix"
import { db } from "~/utils/db.server";


export const loader = async ({ params }) => {
  console.log(params.movieId);
  
  const movies = await db.movie.findUnique({
    where: { id: params.movieId },
  })

  if (!movies) throw new Error('Movie not found')

  const data = { movies }
  return data
}

export default function Movie() {

  const { movie } = useLoaderData()
  console.log(movie);

  return (
    <div>
      <div className='page-header'>
        <h1>{movie.title}</h1>
        <Link to='/'>
          Back
        </Link>
      </div>

      <div>
        {movie.id && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button>Delete</button>
          </form>
        )}
      </div>
    </div>
  )
}