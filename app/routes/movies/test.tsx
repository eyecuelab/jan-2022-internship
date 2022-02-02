import { LoaderFunction, redirect, useLoaderData } from "remix";
import type { Movie } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { movies: Array<Movie> };
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
      //orderBy: { createdAt: "desc" }
    })
  };
  redirect('movies')
  return data;
};

export default function Users() {
  const data = useLoaderData<LoaderData>();
  return (
    <ul>
      {data.movies.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}