import type { FC } from "react";
import { Link, Outlet } from "remix";

const Index: FC = () => {
  return (
    <div>
      <h1>Lets pick a movie</h1>
      <p>Feel free to look around.</p>
      <ul>
        <li>
          <Link to="movies">Begin</Link>
        </li>
      </ul>
    </div>
  );
};

export default Index;
