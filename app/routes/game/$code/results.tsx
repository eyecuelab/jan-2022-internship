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

  const data = await db.movieScore.findMany({
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

  console.log(tmdbList);

  const BASE_URL = "https://api.themoviedb.org/3";
  //const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}&page=2`;
  //const API_URL = `${BASE_URL}/movie/${tmdbList.movies[0].tmdbid}/recommendations?api_key=${process.env.API_KEY}&vote_average.gte=5.0&vote_average.lte=8.0&vote_count.gte=1000`;
  const API_URL = `${BASE_URL}/movie/${tmdbList.movies[0].tmdbid}/recommendations?api_key=${process.env.API_KEY}&vote_average.gte=5.0&vote_average.lte=8.0&vote_count.gte=1000&page=2`;
  const res = await fetch(API_URL);
  const movie1 = await res.json();
  console.log(movie1);

  return { data, movie1, tmdbList };
};

export default function Results() {
  const rand20 = Math.round(Math.random() * 20);
  const { data, movie1, tmdbList } = useLoaderData();
  //console.log(tmdbList.movies[0].tmdbid);

  console.log(movie1.results[rand20]);
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  //const poster = IMG_URL + data[value].posterPath;

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
              {data.map((item) => (
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
