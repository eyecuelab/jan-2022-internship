import { Link, useLoaderData } from "remix"
import { db } from "~/utils/db.server";


export const loader = async ({ params }) => {
  console.log(params.movieId);
  
  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  })

  if (!movie) throw new Error('Movie not found')

  const data = { movie }
  console.log(data);
  return data
  
}

export default function Movie() {

  const { movie } = useLoaderData()
  console.log(movie);

  return (
    <div>
      <div className='page-header'>
        <h1>{movie.title}</h1>
        <h3>{movie.id}</h3>
        <Link to='/movies'>
          Back
        </Link>
      </div>

      <div>
        {movie.id && (
          <form method='POST'>
            <input type='hidden' name='_method' value='yes' />
            <button>Yes</button>
            <input type='hidden' name='_method' value='no' />
            <button>No</button>
          </form>
        )}
      </div>
    </div>
  )
}

