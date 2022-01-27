import type { Movie } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getAndTransformApiMovies } from "./api";

/**
 * Syncs database with the first page of
 * movies from the API
 * @returns number of movies added
 */
export const syncMovies = async (): Promise<number> => {
  try {
    // This could be optimized by storing the api ID
    // as a field in our database and selecting that
    // list of ids out of the db and only inserting
    // the new ones.  If you want to update the other
    // results too you could do that using a transaction
    // but for now this is fine.
    const movieInputs = await getAndTransformApiMovies();
    await db.movie.deleteMany({});
    await db.movie.createMany({ data: movieInputs });
    return movieInputs.length;
  } catch (error) {
    // throw an error if something goes wrong
    // throwing as Response lets remix handle the response
    // to the client
    console.error(error);
    throw new Response(`${error}`, { status: 500 });
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  return db.movie.findMany();
};

export const getMovie = async (id: string): Promise<Movie> => {
  const movie = await db.movie.findUnique({ where: { id } });
  if (!movie) {
    throw new Response("Movie not found", { status: 404 });
  }
  return movie;
};

/**
 *
 * @param id movie id
 * @param tasteProfile boolean, true or false
 * @returns Movie object with tasteProfile field updated
 */
export const updateTasteProfile = async (
  id: string,
  tasteProfile: boolean
): Promise<Movie> => {
  const movie = await db.movie.update({
    where: { id },
    data: { tasteProfile },
  });
  if (!movie) {
    throw new Response("Movie not found", { status: 404 });
  }
  return movie;
};
