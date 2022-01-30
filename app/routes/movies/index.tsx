import { Link } from "react-router-dom";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";



//import Swiper, { SwiperOptions, SwiperSlide } from 'swiper';
//import { Swiper, SwiperSlide } from "swiper/react";

// importing React icons.
import { BsArrowLeftCircle, BsArrowLeftShort, BsArrowLeftSquareFill, BsArrowRight, BsArrowRightShort } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";




// This function happens on the server, so we have access to the server environment files.
// We do data fetching, writing/reading from db, etc and collect data for the client.
export const loader = async () => {
  // Get movies from the movie db API:
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}`;

  const res = await fetch(API_URL);
  const moviesFromAPI = await res.json();
  // const movies = await getMovies();
  // const moviesFromAPI = movies.results;

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


export default function Movies() {
  // UseState with a default value of 0.

  const data = useLoaderData();
  const [value, setValue] = useState(0);

  console.log(data.length);

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + data[value].posterPath;
  //const data = data.results;


  return (
    <>
      <div className="container">
        <img src={poster} alt={data[value].posterPath} />
        <h2>{data[value].id}</h2>
        <h3>{data[value].title}</h3>
        <div>
          <button type="button" onClick={() => value === 0 ? setValue(data.length - 1) : setValue(value - 1)}><BsArrowLeft /></button>
          <button type="button" onClick={() => value === 0 ? setValue(data.length - 1) : setValue(value - 1)}><BsArrowRight /></button>


          {/* <button type="button" onClick={() => value === 0 ? setValue(3) : setValue(value - 1)}><BsArrowLeft /></button>
          <button type="button" onClick={() => value === 3 ? setValue(0) : setValue(value + 1)}><BsArrowRightShort /></button> */}

        </div>
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
