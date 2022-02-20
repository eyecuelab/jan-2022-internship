import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async ({ request, params }) => {
  async function callApiGetDetails(tmdbId: string) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_URL = `${BASE_URL}/movie/${tmdbId}?api_key=${process.env.API_KEY}&append_to_response=videos,runtime,revenue,budget`;
    try {
      const res = await fetch(API_URL);
      const movieData = await res.json();
      return movieData;
    } catch (err) {
      throw err;
      console.log(err);
    }
  }

  const movie1Details = await callApiGetDetails("451048");

  return { movie1Details };
};

export default function MovieResult1() {
  const { movie1Details } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  console.log(movie1Details);

  return (
    <>
      <div className="navigation">test call</div>
    </>
  );
}
