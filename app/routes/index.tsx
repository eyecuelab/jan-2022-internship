import { Link, Outlet } from "remix";

export default function getMovies() {
  return (
    <div>
      <h1>Lets pick a movie</h1>
      <p>Feel free to look around.</p>
      <Outlet />
      <ul>
        <li>
          <Link to="movies">Begin</Link>
        </li>
        <li>
          <Link to="movies/login">Login</Link>
        </li>
        <li>
          <Link to="movies/checkin">
            Check-in
          </Link>
        </li>
      </ul>
    </div>
  );
}
