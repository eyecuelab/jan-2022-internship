import type { Movie } from "@prisma/client";
import type { ApiMovie, DiscoverResponse } from "~/interfaces/moviesDbApi";

async function handleRequest<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

function mapMovie(movie: ApiMovie): Omit<Movie, "id"> {
  return {
    title: movie.title ?? "",
    overview: movie.overview ?? "",
    posterPath: movie.poster_path ?? null,
    tasteProfile: false,
  };
}

/**
 * Fetches the first page of movies from the API
 * and transforms them into the format expected by the database
 * @returns array of movie object without ids
 */
export async function getAndTransformApiMovies(): Promise<Omit<Movie, "id">[]> {
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}`;

  const response = await handleRequest<DiscoverResponse>(API_URL);

  if (!response.results) {
    console.error("No results in response");
    console.error(response);
    throw new Error("Unexpected response from API");
  }

  return response.results.map(mapMovie);
}
