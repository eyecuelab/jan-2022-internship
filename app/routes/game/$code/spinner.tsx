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
import moment from "moment";
import { usePolling } from "~/hooks";
import ReactSpinnerTimer from "react-spinner-timer";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.code;
  const gameLastUpdated = await db.game.findUnique({
    where: { slug },
    select: { updatedAt: true },
  });
  //if (!gameLastUpdated) throw new Error("Game not found");

  console.log(slug);

  const a = moment(new Date());
  const b = moment(gameLastUpdated.updatedAt);

  const timeDiffSec = a.diff(b, "seconds");
  const timeDiffMin = a.diff(b, "minutes");

  console.log(timeDiffSec);
  console.log(timeDiffMin);

  const oneTimeDiff = 59 - timeDiffSec;

  if (timeDiffSec > 59) {
    throw redirect(`/game/${slug}/results`);
  }

  return { slug, timeDiffSec, oneTimeDiff };
};

export default function Spinner() {
  const { slug, oneTimeDiff } = useLoaderData();
  const { timeDiffSec } = usePolling<LoaderData>(
    `/game/${slug}/spinner`,
    useLoaderData<LoaderData>(),
    1000
  );

  const handleChange = (lap) => {
    if (lap.isFinish) console.log("Finished!!");
    else console.log("Running!! Lap:", lap.actualLap);
  };

  return (
    <>
      <h2>Please wait for everyone to finish voting!!</h2>
      <h3>{59 - timeDiffSec}</h3>
      <ReactSpinnerTimer
        timeInSeconds={oneTimeDiff}
        totalLaps={1}
        isRefresh={false}
        onLapInteraction={handleChange}
        isPause={false}
      />
    </>
  );
}
