import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import back from "~/assets/img/back_blue.png";
import tmdbLogo from "~/assets/svg/tmdb_logo.svg";
import { YoutubeEmbed } from "./trailer";
import { Key, MouseEventHandler } from "react";

//export const links = () => [{ rel: "stylesheet", href: modalResult }];

export const loader: LoaderFunction = async ({ params }) => {
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

export default function MovieResult5(props: {
  onRequestClose: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  const { movie5, movie5Details, movie5Cast, movie5WatchProviders } =
    useLoaderData();

  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie5.results[0].poster_path;
  const date = movie5.results[0].release_date;
  const datePattern = /(\d{4})/;
  const year = date.match(datePattern);

  const genresArr: any[] = [];
  movie5Details.genres.forEach(function (entry: { name: string }) {
    if (entry.name) {
      genresArr.push(entry.name);
    }
  });
  const genres = genresArr.slice(0, 3);

  const directors: any[] = [];
  movie5Cast.crew.forEach(function (entry: { job: string; name: string }) {
    if (entry.job === "Director") {
      directors.push(entry.name);
    }
  });

  const actorsArr: any[] = [];
  movie5Cast.cast.forEach(function (entry: { name: string }) {
    if (entry.name) {
      actorsArr.push(entry.name);
    }
  });
  const actors = actorsArr.slice(0, 5);

  const subScore = movie5Details.vote_average;
  const totalVotes = movie5Details.vote_count;
  const votes = (totalVotes / 1000).toFixed(0);
  const score = `${subScore}  (${votes}K)`;

  const trailerArr: any[] = [];
  movie5Details.videos.results.forEach(function (entry: {
    name: string | string[];
    key: any;
  }) {
    if (entry.name.includes("Trailer")) {
      trailerArr.push(entry.key);
    }
  });

  const trailerKey = trailerArr[0];

  let revenue;
  if (movie5Details.revenue === 0 || !movie5Details.budget) {
    revenue = "N/A";
  } else {
    revenue = `$ ${Math.round(movie5Details.revenue / 1000000)} millions`;
  }

  let budget;
  if (movie5Details.budget === 0 || !movie5Details.budget) {
    budget = "N/A";
  } else {
    budget = `$ ${Math.round(movie5Details.budget / 1000000)} millions`;
  }

  const LOGO_URL = "https://image.tmdb.org/t/p/h50";

  return (
    <>
      <div className="navigation">
        {/* <Link to="/">
          <img src={back} alt="back button" />
        </Link> */}
        <button
          onClick={props.onRequestClose}
          style={{ border: "none", background: "transparent" }}
        >
          <img src={back} alt="back button" />
        </button>
      </div>
      <header className="modal-header">
        <button className="modal-btn-number ">5</button>
        <ul style={{ paddingLeft: 12 }}>
          <li>
            <div className="modal-movie-title" title={movie5.results[0].title}>
              {movie5.results[0].title}
            </div>
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
        <div className="bio-page-wrapper">
          <div className="row-bio">
            <div className="col-bio modal-title">GENRES</div>
            <div className="col-bio modal-info">
              <div>
                {genres.map((genre, i) => (
                  <button key={i} className="modal-btn-genre">
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">SCORE</div>
            <div className="col-bio modal-info">
              <span>
                <img src={tmdbLogo} alt="TMDB Logo" style={{ width: "60px" }} />
                <span> </span>
                {score}
              </span>
            </div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">RUNTIME</div>
            <div className="col-bio modal-info ">
              {movie5Details.runtime} min
            </div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">REVENUE</div>
            <div className="col-bio modal-info">{revenue}</div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">BUDGET</div>
            <div className="col-bio modal-info">{budget}</div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">DIRECTOR</div>
            <div className="col-bio modal-info">{directors}</div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title">ACTORS</div>
            <div className="col-bio" id="modal-actors">
              <ul>
                {actors.map((actor, i) => (
                  <li key={i}>{actor}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row-bio">
            <div className="col-bio modal-title top-offset">SYNOPSIS</div>
          </div>

          <div className="row-bio">
            <div className="col-bio">
              <p style={{ color: "#fff" }}>{movie5.results[0].overview}</p>
            </div>
          </div>

          <div className="modal-title top-offset">TRAILER</div>
          <div id="trailer">
            <YoutubeEmbed embedId={trailerKey} />
          </div>
        </div>
      </div>
      <footer className="modal-footer ">
        <div className="modal-title">WHERE TO WATCH</div>
        <ul style={{ color: "#fff", marginTop: "1em" }}>
          <li>
            STREAM
            <div className="modal-row">
              {movie5WatchProviders.results.US?.ads?.map(
                (entry: { logo_path: Key | null | undefined }) => (
                  <div key={entry.logo_path} className="modal-block">
                    <img
                      src={LOGO_URL + entry.logo_path}
                      className="modal-logo"
                    ></img>
                  </div>
                )
              )}
            </div>
            {movie5WatchProviders.results?.US?.flatrate?.map(
              (entry: { logo_path: Key | null | undefined }) => (
                <div key={entry.logo_path} className="modal-block">
                  <img
                    src={LOGO_URL + entry.logo_path}
                    className="modal-logo"
                  ></img>
                </div>
              )
            )}
          </li>
          <li>
            BUY
            <div className="modal-row">
              {movie5WatchProviders.results?.US?.buy?.map(
                (entry: { logo_path: Key | null | undefined }) => (
                  <div key={entry.logo_path} className="modal-block">
                    <img
                      src={LOGO_URL + entry.logo_path}
                      className="modal-logo"
                    ></img>
                  </div>
                )
              )}
            </div>
          </li>
          <li>
            RENT
            <div className="modal-row">
              {movie5WatchProviders.results?.US?.rent?.map(
                (entry: { logo_path: Key | null | undefined }) => (
                  <div key={entry.logo_path} className="modal-block">
                    <img
                      src={LOGO_URL + entry.logo_path}
                      className="modal-logo"
                    ></img>
                  </div>
                )
              )}
            </div>
          </li>
        </ul>
      </footer>
    </>
  );
}
