import { Link } from "react-router-dom";
import { useActionData, useLoaderData, ActionFunction, redirect, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
//import Swiper, { SwiperOptions, SwiperSlide } from 'swiper';
//import { Swiper, SwiperSlide } from "swiper/react";

// importing React icons.
import { BsArrowRight } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";


// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader: LoaderFunction = async () => {
  // Get movies from the movie db API:
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}`;

  const res = await fetch(API_URL);
  const moviesFromAPI = await res.json();

  // Delete all movies in db and then write the newly fetched movies to database:
  await db.movie.deleteMany({});
  await db.movie.createMany({
    data: moviesFromAPI.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
    })),
  });

  // Get the newly written movies from the DB and return them to the client:
  const dbMovies = await db.movie.findMany();
  return dbMovies;
};


export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const actionType = form.get("actionType");

  if (typeof actionType !== "string") {
    return redirect("/auth/login");
  }

  console.log(actionType);
  return actionType;

  // const updatedTaste = await db.movie.update({
  //   where: { id: params.movieId },
  //   data: { tasteProfile: actionType },
  // });

  // const data = { updatedTaste };
  // return data;
};


// async function updateDB() {
//   const params = useLoaderData()
//   const value = useActionData();

//   const updatedTaste = await db.movie.update({
//     where: { id: params.movieId },
//     data: { tasteProfile: value }
//   })

//   if (!value) throw new Error('No input was provided')
//   const data = { updatedTaste }
//   return data;
// }


export default function Movies() {
  // UseState with a default value of 0.
  const data = useLoaderData();
  const [value, setValue] = useState(0);
  const actionData = useActionData();
  console.log(actionData);
  console.log(data.length);
  console.log(value);

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + data[value].posterPath;

  function handleDbUpdateLike() {
    console.log("Yes");
    if (value === 0) {
      setValue(data.length - 1)
    } else {
      setValue(value - 1)
    }
  }

  async function handleDbUpdateDisLike() {
    console.log("No");
    if (value === 0) {
      setValue(data.length - 1)
    } else {
      setValue(value - 1)
    }
  }


  return (
    <>
      <form method="post">
        <div>
          <input type="hidden" name="actionType" value="true" />
          <button type="button" onClick={() => handleDbUpdateLike()}><BsArrowLeft />Yes click</button>

          <input type="hidden" name="actionType" value="false" />
          <button type="button" onClick={() => handleDbUpdateDisLike()}><BsArrowRight />No click</button>
        </div>
      </form>
      <img src={poster} alt={data[value].posterPath} />
      <h2>{data[value].id}</h2>
      <h3>{data[value].title}</h3>
      <div>
        {actionData?.errors ? <p style={{ color: "red" }}>{actionData.errors}</p> : null}
      </div>
    </>
  );
}

























// // This is the react component that renders on the client:
// export default function Movies() {
//   const data = useLoaderData();
//   const IMG_URL = "https://image.tmdb.org/t/p/w500";
//   const movies = data.results;

//   return (
//     <>
//       <Swiper
//         onSlideChange={() => console.log('slide change')}
//         onSwiper={(swiper) => console.log(swiper)}
//       >
//         {movies &&
//           movies.map((movie: any) => {
//             const poster = IMG_URL + movie.posterPath;
//             return (
//               <SwiperSlide key={movie.id} className="swiperSlide">
//                 {/* <Link to={movie.id}> */}
//                 <img src={poster} />
//                 <h4>{movie.title}</h4>
//                 {/* </Link> */}
//               </SwiperSlide>
//             );
//           })}
//       </Swiper>

//     </>
//   );
// }
