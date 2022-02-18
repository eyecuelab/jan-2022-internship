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

  const topFive = await db.movieScore.findMany({
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

  async function callApi(tmdbId: string) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_URL = `${BASE_URL}/movie/${tmdbId}/recommendations?api_key=${process.env.API_KEY}&vote_average.gte=5.0&vote_average.lte=8.0&vote_count.gte=1000`;
    const res = await fetch(API_URL);
    const movieData = await res.json();
    return movieData;
  }

  const movie1 = await callApi(topFive[0].tmdb);
  const movie2 = await callApi(topFive[1].tmdb);
  const movie3 = await callApi(topFive[2].tmdb);
  const movie4 = await callApi(topFive[3].tmdb);
  const movie5 = await callApi(topFive[4].tmdb);

  console.log(movie1.results[0].title);
  console.log(movie2.results[0].title);
  console.log(movie3.results[0].title);
  console.log(movie4.results[0].title);
  console.log(movie5.results[0].title);

  return { topFive, slug, movie1, movie2, movie3, movie4, movie5 };
};

export default function Results() {
  const { slug, movie1, movie2, movie3, movie4, movie5 } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col1">
            <Link to={`/game/${slug}/lobby`}>
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
              <li>
                <button className="movie-btn">{movie1.results[0].title}</button>
              </li>
              <li>
                <button className="movie-btn">{movie2.results[0].title}</button>
              </li>
              <li>
                <button className="movie-btn">{movie3.results[0].title}</button>
              </li>
              <li>
                <button className="movie-btn">{movie4.results[0].title}</button>
              </li>
              <li>
                <button className="movie-btn">{movie5.results[0].title}</button>
              </li>
            </ul>
            {/* <ul>
              {topFive.map((item) => (
                <li key={item.movieId}>
                  <button className="movie-btn">
                    TMDB: {item.tmdb} - likes: {item.likes}
                  </button>
                </li>
              ))}
            </ul> */}
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
