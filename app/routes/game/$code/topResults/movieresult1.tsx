import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import back from "~/assets/img/back_blue.png";
import { YoutubeEmbed } from "./trailer";

//export const links = () => [{ rel: "stylesheet", href: modalResult }];

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

  return { topFive, slug };
};

//Modal.setAppElement("#root");

export default function MovieResult1() {
  const { slug, movie1, movie1Details, movie1Cast, movie1WatchProviders } =
    useLoaderData();

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie1.results[0].poster_path;
  const date = movie1.results[0].release_date;
  const datePattern = /(\d{4})/;
  const year = date.match(datePattern);
  console.log(movie1);
  console.log(movie1Details);
  console.log(movie1Cast);
  console.log(movie1WatchProviders.results.US);

  const genresArr: any[] = [];
  movie1Details.genres.forEach(function (entry) {
    if (entry.name) {
      genresArr.push(entry.name);
    }
  });
  const genres = genresArr.slice(0, 3);

  const directors: any[] = [];
  movie1Cast.crew.forEach(function (entry) {
    if (entry.job === "Director") {
      directors.push(entry.name);
    }
  });

  const actorsArr: any[] = [];
  movie1Cast.cast.forEach(function (entry) {
    if (entry.name) {
      actorsArr.push(entry.name);
    }
  });
  const actors = actorsArr.slice(0, 5);

  const subScore = movie1Details.vote_average;
  const totalVotes = movie1Details.vote_count;
  const votes = (totalVotes / 1000).toFixed(0);
  const score = `${subScore}  (${votes}K)`;

  const trailerArr: any[] = [];
  movie1Details.videos.results.forEach(function (entry) {
    if (entry.name.includes("Official")) {
      trailerArr.push(entry.key);
    }
  });

  const trailerKey = trailerArr[0];

  // const revenue = movie1Details.revenue.toLocaleString("en-US");
  const revenue = movie1Details.revenue / 1000000;
  const budget = movie1Details.budget / 1000000;

  const LOGO_URL = "https://image.tmdb.org/t/p/h50";
  const streamProviderArr: any[] = [];
  movie1WatchProviders.results.US.flatrate.forEach(function (entry) {
    if (entry.provider_name) {
      streamProviderArr.push(entry.provider_name);
    }
  });
  const streamingProviders = streamProviderArr.slice(0, 3);

  const buyProviderArr: any[] = [];
  movie1WatchProviders.results.US.buy.forEach(function (entry) {
    if (entry.provider_name) {
      buyProviderArr.push(entry.provider_name);
    }
  });
  const buyProviders = buyProviderArr.slice(0, 3);

  // const rentProviderArr: any[] = [];
  // movie1WatchProviders.results.US.rent.forEach(function (entry) {
  //   if (entry.provider_name) {
  //     const logo = fetch(`${LOGO_URL + entry.logo_path}`);
  //     return logo;
  //   }
  // });
  // const rentProviders = rentProviderArr.slice(0, 3);
  // console.log(rentProviders);

  return (
    <>
      <div className="navigation">
        <Link to="/">
          <img src={back} alt="back button" />
        </Link>
      </div>
      <header className="modal-header">
        <button className="modal-btn-number ">1</button>
        <ul style={{ paddingLeft: 12 }}>
          <li>
            <h2>{movie1.results[0].title}</h2>
          </li>
          <li>
            <p>{year[0]}</p>
          </li>
        </ul>
      </header>
      <div>
        <img src={poster} alt="poster" className="modal-img" />
      </div>
      <div className="modal-grid-container">
        <div className="modal-grid-item">
          <ul>
            <li>
              GENRES <span>{genres}</span>
            </li>
            <li>
              SCORE <span id="modal-score">{score}</span>
            </li>
            <li>
              RUNTIME
              <span id="modal-runtime">{movie1Details.runtime} min</span>
            </li>
            <li>
              REVENUE
              <span id="modal-revenue">
                $ {revenue} millions of paper money
              </span>
            </li>
            <li>
              BUDGET
              <span id="modal-budget">$ {budget} </span>
            </li>
            <li>
              DIRECTOR <span id="modal-director">{directors}</span>
            </li>
            <li>
              CAST <span id="modal-actors">{actors}</span>
            </li>
          </ul>
        </div>
        <div className="grid-item">
          <h5>SYNOPSIS</h5>
          <p>{movie1.results[0].overview}</p>
        </div>
        <div className="grid-item">
          <h5>TRAILER</h5>
          <YoutubeEmbed embedId={trailerKey} />
        </div>
      </div>
      <footer className="modal-footer ">
        <h5>WHERE TO WATCH</h5>
        <ul>
          <li>
            STREAM
            <div className="modal-row">
              {movie1WatchProviders.results.US.flatrate.map((entry, i) => (
                <div
                  key={movie1WatchProviders.results.US.flatrate[i].logo_path}
                  className="modal-block"
                >
                  <img
                    src={LOGO_URL + entry.logo_path}
                    className="modal-logo"
                  ></img>
                </div>
              ))}
            </div>
          </li>
          <li>
            BUY
            <div className="modal-row">
              {movie1WatchProviders.results.US.buy.map((entry, i) => (
                <div
                  key={movie1WatchProviders.results.US.buy[i].logo_path}
                  className="modal-block"
                >
                  <img
                    src={LOGO_URL + entry.logo_path}
                    className="modal-logo"
                  ></img>
                </div>
              ))}
            </div>
          </li>
          <li>
            RENT
            <div className="modal-row">
              {movie1WatchProviders.results.US.rent.map((entry, i) => (
                <div
                  key={movie1WatchProviders.results.US.rent[i].logo_path}
                  className="modal-block"
                >
                  <img
                    src={LOGO_URL + entry.logo_path}
                    className="modal-logo"
                  ></img>
                </div>
              ))}
            </div>
          </li>
        </ul>
      </footer>
    </>
  );
}
