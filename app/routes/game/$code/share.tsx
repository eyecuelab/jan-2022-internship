import { ActionFunction, json, Link, useLoaderData, useParams } from "remix";
import Game from "~/routes/game";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";
import { usePolling } from "~/hooks";
import letsplay from "~/assets/img/letsplay.png";
import home from "~/assets/img/home.png";
import back from "~/assets/img/back.png";
import shareStyles from "~/styles/share.css";
import { Container, Col, Row } from "react-bootstrap";

export const links = () => [{ rel: "stylesheet", href: shareStyles }];

export const loader: ActionFunction = async ({ request, params }) => {
  const slug = params.code;
  //const { slug } = params;
  console.log(slug);

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

  const movieObj = await db.movie.findMany({
    select: { id: true, title: true },
  });

  const allMovies = movieObj.map((item) => {
    return item.id;
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
          movieId: item,
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
  //  const { slug } = useParams();
  const { data, player, playersArr, status } = usePolling<LoaderData>(
    `/game/${slug}/lobby`,
    useLoaderData<LoaderData>(),
    1000
  );

  return (
    <>
      {/* <Container>
        <Row>
          <Col xs={6} md={4}>
            <nav className="btn-back">
              <div>
                <img src={back} alt="back button" />
              </div>
              <div className="btn-home">
                <img src={home} alt="home button" />
              </div>
            </nav>
          </Col>
        </Row>
      </Container> */}

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
        <img src={letsplay} alt="letsplay icon" />
        <h2>Share This Code</h2>
        <p>
          Share this code with your friends so they can play along in finding
          your perfect movie match.
        </p>
      </div>
      <div className="container">
        <div className="item1">
          <button className="btn-code">
            <h5>Your code </h5>
            <h2 className="code">{slug}</h2>
          </button>
        </div>
        <div className="item2">
          <button className="btn-share glow-button">Share</button>
        </div>
      </div>
      <div id="footer">
        <button className="btn-lobby glow-button">
          <Link
            to={`/game/${slug}/lobby`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Got to Lobby
          </Link>
        </button>
      </div>
    </>
  );
}

//   return (
//     <div className="error-container">
//       <pre>{error.message}</pre>
//     </div>
//   );
// }
// function movieIdArr(movieIdArr: any) {
//   throw new Error("Function not implemented.");
// }
function getAllMovies(): import("react").EffectCallback {
  throw new Error("Function not implemented.");
}
