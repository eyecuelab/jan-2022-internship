import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import home from "~/assets/img/home.png";
import back from "~/assets/img/back.png";
import final from "~/assets/img/final.png";
import resultStyles from "~/styles/results.css";

export const links = () => [{ rel: "stylesheet", href: resultStyles }];

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!game) throw new Error("Game not found");
  const gameId = game.id;

  const topSelection = await db.movieScore.findMany({
    take: 5,
    where: {
      game: { id: gameId },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
    select: { movieId: true, tmdb: true, likes: true },
    orderBy: { likes: "desc" },
  });

  const tmdbList = {
    movies: await db.movie.findMany({
      take: 5,
      select: { id: true, tmdbid: true },
    }),
  };

  return topSelection;
};

export default function Results() {
  const topSelection = useLoaderData();
  console.log(topSelection);

  return (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col1">
            <Link to="/">
              <img src={back} alt="back button" />
            </Link>
          </div>
          <div className="col2">
            <Link to="/">
              <img src={home} alt="home button" />
            </Link>
          </div>
        </div>
        <img src={final} alt="final icon" />
        <h2>Watch This!</h2>
        <p>
          Everyone has voted and you’re ready for movie night. Click a title to
          see more info about the movie. Enjoy!
        </p>
      </div>
      <div className="container">
        <div className="item1"></div>
        <div className="item2">
          <div>
            <ul>
              {topSelection.map((item) => (
                <li key={item.movieId}>
                  <button className="movie-btn">
                    TMDB: {item.tmdb} - likes: {item.likes}
                    {/* Movie ID: total likes: {item.likes} */}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div id="footer">
        <button className="btn-more glow-button">
          <Link
            //to={`/game/${slug}/lobby`}
            to={`/`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Show More
          </Link>
        </button>
      </div>
    </>
  );
}
