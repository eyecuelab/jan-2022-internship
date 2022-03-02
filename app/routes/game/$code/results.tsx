import {
  Form,
  Link,
  LoaderFunction,
  NavLink,
  redirect,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import home from "~/assets/img/home.png";
import back from "~/assets/img/back.png";
import final from "~/assets/img/final.png";
import resultsPageStyles from "~/styles/results.css";
import { useEffect, useState } from "react";
import MovieResult1 from "./topResults/movieresult1";
import MovieResult2 from "./topResults/movieresult2";
import MovieResult3 from "./topResults/movieresult3";
import Modal from "react-modal";
import MovieResult4 from "./topResults/movieresult4";
import MovieResult5 from "./topResults/movieresult5";
import ConfettiExplosion from "react-confetti-explosion";

export const links = () => [{ rel: "stylesheet", href: resultsPageStyles }];

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

  async function callApiGetDetails(tmdbId: string) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_URL = `${BASE_URL}/movie/${tmdbId}?api_key=${process.env.API_KEY}&append_to_response=videos,runtime,revenue,budget`;
    try {
      const res = await fetch(API_URL);
      const movieData = await res.json();
      return movieData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function callApiGetCredits(tmdbId: string) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_URL = `${BASE_URL}/movie/${tmdbId}/credits?api_key=${process.env.API_KEY}`;
    try {
      const res = await fetch(API_URL);
      const movieData = await res.json();
      return movieData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function callApiGetProviders(tmdbId: string) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_URL = `${BASE_URL}/movie/${tmdbId}/watch/providers?api_key=${process.env.API_KEY}`;
    try {
      const res = await fetch(API_URL);
      const movieData = await res.json();
      return movieData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const movie1 = await callApi(topFive[0].tmdb);
  const movie2 = await callApi(topFive[1].tmdb);
  const movie3 = await callApi(topFive[2].tmdb);
  const movie4 = await callApi(topFive[3].tmdb);
  const movie5 = await callApi(topFive[4].tmdb);

  const movie1Details = await callApiGetDetails(movie1.results[0].id);
  const movie1Cast = await callApiGetCredits(movie1.results[0].id);
  const movie1WatchProviders = await callApiGetProviders(movie1.results[0].id);

  const movie2Details = await callApiGetDetails(movie2.results[0].id);
  const movie2Cast = await callApiGetCredits(movie2.results[0].id);
  const movie2WatchProviders = await callApiGetProviders(movie2.results[0].id);

  const movie3Details = await callApiGetDetails(movie3.results[0].id);
  const movie3Cast = await callApiGetCredits(movie3.results[0].id);
  const movie3WatchProviders = await callApiGetProviders(movie3.results[0].id);

  const movie4Details = await callApiGetDetails(movie4.results[0].id);
  const movie4Cast = await callApiGetCredits(movie4.results[0].id);
  const movie4WatchProviders = await callApiGetProviders(movie4.results[0].id);

  const movie5Details = await callApiGetDetails(movie5.results[0].id);
  const movie5Cast = await callApiGetCredits(movie5.results[0].id);
  const movie5WatchProviders = await callApiGetProviders(movie5.results[0].id);

  return {
    topFive,
    slug,
    movie1,
    movie1Details,
    movie1Cast,
    movie1WatchProviders,
    movie2,
    movie2Details,
    movie2Cast,
    movie2WatchProviders,
    movie3,
    movie3Details,
    movie3Cast,
    movie3WatchProviders,
    movie4,
    movie4Details,
    movie4Cast,
    movie4WatchProviders,
    movie5,
    movie5Details,
    movie5Cast,
    movie5WatchProviders,
  };
};

export const action = async ({ request }) => {
  return redirect("/");
};

export default function Results() {
  const { slug, movie1, movie2, movie3, movie4, movie5 } = useLoaderData();
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);

  //const date = movie1.results[0].release_date;
  const datePattern = /(\d{4})/;
  const yearMade1 = movie1.results[0].release_date.match(datePattern);
  const yearMade2 = movie2.results[0].release_date.match(datePattern);
  const yearMade3 = movie3.results[0].release_date.match(datePattern);
  const yearMade4 = movie4.results[0].release_date.match(datePattern);
  const yearMade5 = movie5.results[0].release_date.match(datePattern);
  const LOGO_URL = "https://image.tmdb.org/t/p/h100";

  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setIsExploding(true);
  }, []);

  return (
    <>
      <div className="header">
        <div className="cannon">
          {isExploding && (
            <ConfettiExplosion
              duration={5000}
              floorWidth={2000}
              floorHeight={2000}
              particleCount={200}
            />
          )}
        </div>
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
                <button
                  className="movie-btn"
                  onClick={() => {
                    setModalIsOpen1(true), setIsExploding(false);
                  }}
                >
                  <div className="btn-items">
                    <div className="number-in-button">1</div>
                    <div>
                      <img
                        src={LOGO_URL + movie1.results[0].poster_path}
                        alt="poster"
                        className="poster-in-button"
                      />
                    </div>
                    <div
                      className="title-in-button"
                      title={movie1.results[0].title}
                    >
                      {movie1.results[0].title}
                      <p>{yearMade1[0]}</p>
                    </div>
                  </div>
                </button>
                <Modal
                  isOpen={modalIsOpen1}
                  onRequestClose={() => setModalIsOpen1(false)}
                  style={{
                    overlay: {
                      backgroundColor: "#0A1039",
                    },
                    content: {
                      margin: "auto",
                      color: "#212F52",
                      maxWidth: "600px",
                      height: "90vh",
                    },
                  }}
                >
                  <MovieResult1 onRequestClose={() => setModalIsOpen1(false)} />
                </Modal>
              </li>
              <li>
                <button
                  className="movie-btn"
                  onClick={() => {
                    setModalIsOpen2(true), setIsExploding(false);
                  }}
                >
                  <div className="btn-items">
                    <div className="number-in-button">2</div>
                    <div>
                      <img
                        src={LOGO_URL + movie2.results[0].poster_path}
                        alt="poster"
                        className="poster-in-button"
                      />
                    </div>
                    <div
                      className="title-in-button"
                      title={movie2.results[0].title}
                    >
                      {movie2.results[0].title}
                      <p>{yearMade2[0]}</p>
                    </div>
                  </div>
                </button>
                <Modal
                  isOpen={modalIsOpen2}
                  onRequestClose={() => setModalIsOpen2(false)}
                  style={{
                    overlay: {
                      backgroundColor: "#0A1039",
                    },
                    content: {
                      margin: "auto",
                      color: "#212F52",
                      maxWidth: "600px",
                      height: "95vh",
                    },
                  }}
                >
                  <MovieResult2 onRequestClose={() => setModalIsOpen2(false)} />
                </Modal>
              </li>
              <li>
                <button
                  className="movie-btn"
                  onClick={() => {
                    setModalIsOpen3(true), setIsExploding(false);
                  }}
                >
                  <div className="btn-items">
                    <div className="number-in-button">3</div>
                    <div>
                      <img
                        src={LOGO_URL + movie3.results[0].poster_path}
                        alt="poster"
                        className="poster-in-button"
                      />
                    </div>
                    <div
                      className="title-in-button"
                      title={movie3.results[0].title}
                    >
                      {movie3.results[0].title}
                      <p>{yearMade3[0]}</p>
                    </div>
                  </div>
                </button>
                <Modal
                  isOpen={modalIsOpen3}
                  onRequestClose={() => setModalIsOpen3(false)}
                  style={{
                    overlay: {
                      backgroundColor: "#0A1039",
                    },
                    content: {
                      margin: "auto",
                      color: "#212F52",
                      maxWidth: "600px",
                      height: "95vh",
                    },
                  }}
                >
                  <MovieResult3 onRequestClose={() => setModalIsOpen3(false)} />
                </Modal>
              </li>
              <li>
                <button
                  className="movie-btn"
                  onClick={() => {
                    setModalIsOpen4(true), setIsExploding(false);
                  }}
                >
                  <div className="btn-items">
                    <div className="number-in-button">4</div>
                    <div>
                      <img
                        src={LOGO_URL + movie4.results[0].poster_path}
                        alt="poster"
                        className="poster-in-button"
                      />
                    </div>
                    <div
                      className="title-in-button"
                      title={movie4.results[0].title}
                    >
                      {movie4.results[0].title}
                      <p>{yearMade4[0]}</p>
                    </div>
                  </div>
                </button>
                <Modal
                  isOpen={modalIsOpen4}
                  onRequestClose={() => setModalIsOpen4(false)}
                  style={{
                    overlay: {
                      backgroundColor: "#0A1039",
                    },
                    content: {
                      margin: "auto",
                      color: "#212F52",
                      maxWidth: "600px",
                      height: "95vh",
                    },
                  }}
                >
                  <MovieResult4 onRequestClose={() => setModalIsOpen4(false)} />
                </Modal>
              </li>
              <li>
                <button
                  className="movie-btn"
                  onClick={() => {
                    setModalIsOpen5(true), setIsExploding(false);
                  }}
                >
                  <div className="btn-items">
                    <div className="number-in-button">5</div>
                    <div>
                      <img
                        src={LOGO_URL + movie5.results[0].poster_path}
                        alt="poster"
                        className="poster-in-button"
                      />
                    </div>
                    <div
                      className="title-in-button"
                      title={movie5.results[0].title}
                    >
                      {movie5.results[0].title}
                      <p> {yearMade5[0]}</p>
                    </div>
                  </div>
                </button>
                <Modal
                  isOpen={modalIsOpen5}
                  onRequestClose={() => setModalIsOpen5(false)}
                  style={{
                    overlay: {
                      backgroundColor: "#0A1039",
                    },
                    content: {
                      margin: "auto",
                      color: "#212F52",
                      maxWidth: "600px",
                      height: "95vh",
                    },
                  }}
                >
                  <MovieResult5 onRequestClose={() => setModalIsOpen5(false)} />
                </Modal>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="footer">
        {/* <NavLink to={`/`}>
          <button className="btn-more glow-button">Play Again</button>
        </NavLink> */}
        <Form method="post">
          <button
            className="btn-more glow-button"
            onClick={() => setIsExploding(false)}
          >
            Play Again
          </button>
        </Form>
      </div>
    </>
  );
}
