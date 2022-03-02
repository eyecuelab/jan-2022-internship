import { json, Link, LoaderFunction, NavLink, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";
import { usePolling } from "~/hooks";
import letsplay from "~/assets/img/letsplay.png";
import home from "~/assets/img/home.png";
import back from "~/assets/img/back.png";
import copy from "~/assets/img/copy.png";
import shareStyles from "~/styles/share.css";
import ReactTooltip from "react-tooltip";

export const links = () => [{ rel: "stylesheet", href: shareStyles }];

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;

  const data = {
    movies: await db.movie.findMany({
      select: { id: true, title: true },
    }),
  };

  //get game's unique id and status
  const game = await db.game.findUnique({
    where: { slug },
    select: { id: true, isStarted: true },
  });

  if (!game) throw new Error("Game not found");

  //get all players in the game
  const gamePlayers = await db.game.findMany({
    where: { slug },
    select: {
      players: { include: { player: { select: { username: true } } } },
    },
  });

  const gameId = game.id;
  const gameStatus = game.isStarted;
  const status = gameStatus;
  console.log(status);

  //get movie's unique id
  const movie = await db.movie.findUnique({
    where: { id: data.movies[0].id },
  });
  if (!movie) throw new Error("Movie not found");

  // const movieObjFromBaseTable = await db.moviebase.findMany({
  //   select: { id: true, title: true, tmdbid: true },
  // });

  const movieObj = await db.movie.findMany({
    select: { id: true, title: true, tmdbid: true },
  });

  const allMovies = movieObj.map((item) => {
    return item;
  });

  const allTitles = movieObj.map((item) => {
    return item.title;
  });

  console.log(allTitles);
  console.log(allMovies);

  if (!status) {
    //insert all movies in MovieScore table
    allMovies.map(async (item, i) => {
      await db.movieScore.create({
        data: {
          movieId: item.id,
          tmdb: item.tmdbid,
          position: i + 1,
          gameId,
          likes: 0,
          dislikes: 0,
        },
        include: { movie: true },
      });
    });

    //const gameId = game.id;
    await db.game.update({
      where: { id: gameId },
      data: { isStarted: true },
    });
  } else {
    if (!allMovies) {
      throw json("Movies already added.", 404);
    }
  }

  //get current user
  const player = await requireUser(request);

  //get all users playing the game
  const {
    0: {
      players: { ...playersObj },
    },
  } = gamePlayers;
  const playersArr = Object.values(playersObj);

  //get ordered list of movies
  const movieList = {
    movies: await db.movieScore.findMany({
      where: { game },
      select: { id: true, position: true },
      orderBy: {
        position: "asc",
      },
    }),
  };

  const movieQueue = await db.movieScore.findMany({
    where: {
      game: { id: game.id },
      AND: [
        {
          movie: { id: params.movieId },
        },
      ],
    },
  });

  console.log("current movie position:");
  console.log(movieQueue[0].position);

  return { data, player, slug, playersArr, status };
};

export default function Lobby() {
  const { slug } = useLoaderData();
  const { data, player, playersArr, status } = usePolling<LoaderData>(
    `/game/${slug}/lobby`,
    useLoaderData<LoaderData>(),
    1000
  );

  const handleShareButton = () => {
    // Check if navigator.share is supported by the browser
    if (navigator.share) {
      console.log("Congrats! Your browser supports Web Share API");
      navigator
        .share({
          //get link game lobby
          //url: `/game/${slug}/lobby`,
          //only code for now
          title: `Your token: ${slug}`,
          text: "Follow the link, join the game, enter the token.",
          url: `/`,
        })
        .then(() => {
          console.log("Sharing successfull");
        })
        .catch(() => {
          console.log("Sharing failed");
        });
      <br />;
    } else {
      console.log("Sorry! Your browser does not support Web Share API");
    }
  };

  return (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col1">
            <Link to={`/new`}>
              <img src={back} alt="back button" />
            </Link>
          </div>
          <div className="col2">
            <Link to="/">
              <img src={home} alt="home button" />
            </Link>
          </div>
        </div>
        <img src={letsplay} alt="letsplay icon" className="play" />
        <h2>Share This Code</h2>
        <p>
          Share this code with your friends so they can play along in finding
          your perfect movie match.
        </p>
      </div>
      <div className="container">
        <div className="item1">
          <button
            onClick={() => navigator.clipboard.writeText(`${slug}`)}
            data-tip
            data-for="registerTip"
            className="btn-share"
          >
            <div className="your-code">
              Your code
              <span>
                <img src={copy} alt="copy icon" className="copy-icon" />
              </span>
            </div>
            <div></div>
            <div className="code">{slug}</div>
          </button>
        </div>
        <div className="item2">
          <button
            onClick={handleShareButton}
            className="btn-share glow-button share-button"
          >
            Share
          </button>
        </div>
        <ReactTooltip id="registerTip" place="top" effect="solid">
          Copy
        </ReactTooltip>
      </div>
      <div id="footer">
        <NavLink to={`/game/${slug}/lobby`}>
          <button className="btn-lobby glow-button">Got to Lobby</button>
        </NavLink>
      </div>
    </>
  );
}
