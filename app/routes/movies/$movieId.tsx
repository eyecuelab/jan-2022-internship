import { Link, redirect, useActionData, useLoaderData } from "remix"
import { db } from "~/utils/db.server";

// export const action: ActionFunction = async ({ params }) => {
//   const movieLike = await db.movie.findUnique({
//     where: { id: params.movieId },
//   })
//   console.log(movieLike);
// }


export async function action({ request, params }) {
  const formData = await request.formData();
  let value = Object.fromEntries(formData)
  return value;
  }

  // export async function updateDB(){
  //     const vote = useActionData();
  //     const tasteUpdate = await db.movie.update({
  //     where: { id: params.movieId },
  //     data: { tasteProfile: vote}
  //   })
  //   if (!vote) throw new Error('No input was provided')
    
  //   const data = { tasteUpdate }
  //   console.log(data);
  
  //   // redirect(`/movies/${movie.id}`);
  //   // return data
    
  //   return tasteUpdate;
    
    
    
  //   //console.log(data);
  //   //return data;
  // }
  
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

  const vote = useActionData()
  console.log(vote);
  

  return (
    <div>
      <div className='page-header'>
      <Link to='/movies'>
          Back
        </Link>
        <h1>{movie.title}</h1>
        <h3>{movie.id}</h3>
        <img src={poster} />
      </div>

      <div>
        {movie.id && (
          <>
          <form method='post'>
            <input type='hidden' name='actionType' value='true' />
            <button type="submit">Yes</button>
            </form > 

            <form method='post'>
            <input type='hidden' name='actionType' value='no' />
           <button type="submit">No</button>
          </form > 
          </>
        )}
      </div>
    </div>
  )
}

