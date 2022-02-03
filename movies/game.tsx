import type { Player, MovieGame } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { Link, Outlet } from "remix";
import { formatRelativeDate } from "~/utils/date";
import { db } from "~/utils/db.server";
import { getPlayer } from "~/utils/session.server";

type LoaderData = {
  liveGames: Array<
    Pick<MovieGame, "slug" | "startedAt">>;
  user: Player | null;
};
export const loader: LoaderFunction = async ({ request }) => {
  const gameIsLive = { startedAt: { not: null }, endedAt: null };

  const liveGameCount = await db.movieGame.count({});

  const take = Math.min(liveGameCount, 5);

  const liveGames = await db.movieGame.findMany({
    select: { slug: true, startedAt: true },
    take,
    orderBy: { startedAt: "desc" },
  });
  const user = await getPlayer(request);

  const data: LoaderData = { liveGames, user };
  return liveGameCount;
};

export default function MovieRoute() {
  const { liveGames, user } = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <div className="container">
          <Link to="/" title="home"></Link>
          {user ? (
            <div>
              <div>
                <span>{`Hi, ${user.username}`}</span>
                <Link to="/game" title="My Games">
                  <span>your games</span>
                </Link>
              </div>
              <form action="/logout" method="post">
                <button type="submit">Logout</button>
              </form>
            </div>
          ) : (
            <div>
              <Link to="login">Login</Link>
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="container">
          <div>
            <Outlet />
          </div>
          <div>
            <p>Current games:</p>
            <ul>
              {liveGames === 'undefined' ? (
                liveGames.map(({ slug, startedAt }) => (
                  <li key={slug}>
                    <Link
                      to={`/trivia/${slug}/play`}
                      className="live-game-link"
                    >

                      <small>{`started: ${startedAt ? formatRelativeDate(startedAt) : ""
                        }`}</small>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <em>No games are currently live.</em>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
