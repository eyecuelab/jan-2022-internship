import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import home from "~/assets/img/home.png";
import spinnerStyles from "~/styles/spinner.css";
import moment from "moment";
import { usePolling } from "~/hooks";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export const links = () => [{ rel: "stylesheet", href: spinnerStyles }];

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.code;
  const gameLastUpdated = await db.game.findUnique({
    where: { slug },
    select: { updatedAt: true },
  });

  if (!gameLastUpdated) throw new Error("Game has not been updated");
  const a = moment(new Date());
  const b = moment(gameLastUpdated.updatedAt);

  const timeDiffSec = a.diff(b, "seconds");

  const oneTimeDiff = 59 - timeDiffSec;

  if (timeDiffSec > 59) {
    throw redirect(`/game/${slug}/results`);
  }

  return { slug, timeDiffSec, oneTimeDiff };
};

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Almost done...</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

export default function Spinner() {
  const { slug, oneTimeDiff } = useLoaderData();
  usePolling(`/game/${slug}/spinner`, useLoaderData(), 1000);

  return (
    <>
      <div className="header">
        <div className="flex-grid">
          <div className="col2">
            <Link to="/">
              <img src={home} alt="home button" />
            </Link>
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>We Read Your Mind</h1>
      </div>
      <div className="container">
        <h2>
          Calculating Your Vibe!
          <br />
        </h2>
        <div className="timer-wrapper">
          <CountdownCircleTimer
            isPlaying
            duration={oneTimeDiff}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[10, 6, 3, 0]}
            onComplete={() => ({ shouldRepeat: false, delay: 5 })}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
      </div>
    </>
  );
}
