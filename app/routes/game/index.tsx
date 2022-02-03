import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    movies: await db.movie.findMany({
      take: 20,
      select: { id: true, title: true },
      // orderBy: { createdAt: "desc" },
    }),
  };

  return data;
};

export default function DisplayMovies() {
  const { movies } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          The Game is On
        </Link>
      </div>
      <ul className="posts-list">
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={movie.id}>
              <h3>{movie.title}</h3>
              {new Date(movie.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

