import type { FC } from "react";
import { Outlet } from "remix";

const Movies: FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Movies;
