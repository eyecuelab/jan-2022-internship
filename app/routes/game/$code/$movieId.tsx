import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
} from "remix";
//import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { getPlayer } from "~/utils/session.server";
import movieStyles from "~/styles/movie.css";
import back from "~/assets/img/back.png";
import home from "~/assets/img/home.png";
import like from "~/assets/img/like.png";
import dislike from "~/assets/img/dislike.png";
import { useEffect, useState } from "react";
// import { useInterval } from "usehooks-ts";
import Countdown from "react-countdown";

export const links = () => [{ rel: "stylesheet", href: movieStyles }];

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!game) throw new Error("Game not found");

  const movie = await db.movie.findUnique({
    where: { id: params.movieId },
  });
  if (!movie) throw new Error("Movie not found");

  const movieList = {
    movies: await db.movieScore.findMany({
      where: { game },
      select: { id: true, position: true },
      orderBy: {
        position: "asc",
      },
    }),
  };

  const currMoviePosition = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  console.table(movieList.movies);
  console.log("Total number of movies:");
  const totalMoviesNumber = Object.keys(movieList.movies).length;
  console.log(totalMoviesNumber);
  console.log("Current movie position:");
  console.log(currMoviePosition[0].position);
  // console.log(currMoviePosition[0]);
  // const nextPosition = currMoviePosition[0].position + 1;
  // console.log("next position");
  // console.log(nextPosition);
  //console.log(Object.keys(movieList.movies).length);

  const moviesLeft = totalMoviesNumber - currMoviePosition[0].position;
  console.log(moviesLeft);
  const player = await getPlayer(request);

  return {
    movie,
    player,
    game,
    slug,
    movieList,
    currMoviePosition,
    moviesLeft,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const slug = params.code;

  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!game) throw new Error("Game not found");

  const currMoviePosition = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  const nextPosition = currMoviePosition[0].position;

  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true },
    }),
  };
  if (!data) throw new Error("Game not found");
  const gameId = game.id;

  if (typeof actionType !== "string") {
    throw new Error(`No action type found in form data.`);
  }

  //should return total number of movies provided in base table - Movies
  //const totalMoviesNumber = Object.keys(data.movies).length;
  //console.log(totalMoviesNumber);

  switch (actionType) {
    case "yes": {
      await db.movieScore.updateMany({
        where: {
          game: { id: gameId },
          AND: [
            {
              movie: { id: params.movieId },
            },
          ],
        },
        data: {
          likes: { increment: 1 },
        },
      });

      const nextMovie = data.movies[nextPosition];
      if (nextMovie === undefined) {
        throw redirect(`/game/${slug}/results`);
      } else {
        throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
      }
    }
    case "no": {
      await db.movieScore.updateMany({
        where: {
          game: { id: gameId },
          AND: [
            {
              movie: { id: params.movieId },
            },
          ],
        },
        data: {
          likes: { increment: -1 },
        },
      });

      const nextMovie = data.movies[nextPosition];
      if (nextMovie === undefined) {
        throw redirect(`/game/${slug}/results`);
      } else {
        throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
      }
    }
    default: {
      throw json("Invalid action type.", 400);
    }
  }
};

export default function Movie() {
  const { movie, moviesLeft, slug } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();
  const navigate = useNavigate();
  const transition = useTransition();

  // const [count, setCount] = useState<number>(3);
  // const [delay, setDelay] = useState<number>(1000);
  // const [isPlaying, setPlaying] = useState<boolean>(true);

  // useInterval(
  //   () => {
  //     // Your custom logic here
  //     if (count === 0) {
  //       console.log("time is out");
  //       navigate(`/game/${slug}/results`, { replace: true });
  //     } else {
  //       setCount(count - 1);
  //     }
  //   },
  //   // Delay in milliseconds or null to stop it
  //   isPlaying ? delay : null
  // );

  const TimesUp = () => (
    <span>
      <h1>Time is up!</h1>
    </span>
  );

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      sessionStorage.clear();
      return <TimesUp />;
    } else {
      // Render a countdown
      return (
        <span>
          <h1>:{seconds}</h1>
        </span>
      );
    }
  };
  const getSessionStorageValue = (s: string) => sessionStorage.getItem(s);

  const [data, setData] = useState({ date: Date.now(), delay: 60000 });
  const wantedDelay = 60000;

  //[START] componentDidMount
  //Code runs only one time after each reloading
  useEffect(() => {
    const savedTime = getSessionStorageValue("end_time");
    if (savedTime != null && !isNaN(savedTime)) {
      const currentTime = Date.now();
      const delta = parseInt(savedTime, 10) - currentTime;

      //Do you reach the end?
      if (delta > wantedDelay) {
        //Yes we clear uour saved end date
        if (sessionStorage.getItem("end_time").length > 0)
          sessionStorage.removeItem("end_time");
      } else {
        //No update the end date with the current date
        setData({ date: currentTime, delay: delta });
      }
    }
  }, []);
  //[END] componentDidMount

  return transition.submission ? (
    Object.fromEntries(transition.submission.formData)
  ) : (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col1">
            <Link to="/lobby">
              <img src={back} alt="back button" />
            </Link>
          </div>
          <div className="col2">
            <Link to="/">
              <img src={home} alt="home button" />
            </Link>
          </div>
        </div>
        <h2>Find Your Vibe</h2>
        <p>
          Judge a flick by its cover. In this timed speed round we’ll discover
          what type of movie you feel like watching.
        </p>
      </div>
      <div className="container">
        <div>
          <div className="movies">
            <div className="counter">
              <Countdown
                date={data.date + data.delay}
                renderer={renderer}
                onStart={(delta) => {
                  //Save the end date
                  if (sessionStorage.getItem("end_time") == null)
                    sessionStorage.setItem(
                      "end_time",
                      JSON.stringify(data.date + data.delay)
                    );
                }}
                onComplete={() => {
                  if (sessionStorage.getItem("end_time") != null)
                    sessionStorage.removeItem("end_time");
                  navigate(`/game/${slug}/results`, { replace: true });
                }}
              />
            </div>
            <img src={poster} className="poster" />
          </div>
          <div>
            {vote?.errors ? (
              <p style={{ color: "red" }}>{vote.errors}</p>
            ) : null}
          </div>
        </div>
      </div>
      {movie.id && (
        <>
          <div id="footer">
            <div className="flex-grid">
              <div className="col1-footer">
                <form method="post">
                  <input type="hidden" name="actionType" value="no" />
                  <button type="submit" className="btn glow-button">
                    <img src={dislike} alt="dislike button" />
                  </button>
                </form>
              </div>
              <div className="col2-footer">
                <button disabled className="btn-slide-n">
                  {moviesLeft + 1}
                </button>
              </div>
              <div className="col3-footer"></div>
              <form method="post">
                <input type="hidden" name="actionType" value="yes" />
                <button type="submit" className="btn glow-button">
                  <img src={like} alt="like button" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
