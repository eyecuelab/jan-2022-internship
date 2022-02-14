import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
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
import rect1 from "~/assets/img/rect1.png";
import rect2 from "~/assets/img/rect2.png";

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

      //throw redirect(`/game/${slug}/${data.movies[nextPosition].id}`);
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
  const { movie, moviesLeft } = useLoaderData();
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const poster = IMG_URL + movie.posterPath;
  const vote = useActionData();

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
        <h2>Find Your Vibe</h2>
        <p>
          Judge a flick by its cover. In this timed speed round we’ll discover
          what type of movie you feel like watching.
        </p>
      </div>
      <div className="container">
        <div>
          <div className="movies">
            <img src={poster} className="poster" />
            {/* <img src={rect1} className="rect-img1" />
            <img src={rect2} className="rect-img2" /> */}
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
