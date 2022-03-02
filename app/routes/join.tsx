import { ActionFunction, Form, redirect, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import {
  getPlayerId,
  requirePlayerId,
  requireUser,
} from "~/utils/session.server";
import banner from "~/assets/svg/banner3.png";
import joinStyles from "~/styles/join.css";

export const links = () => [{ rel: "stylesheet", href: joinStyles }];

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  // const user = await requireUser(request);
  // console.log(user.id);

  const user = await requireUser(request);
  if (!user) {
    return null;
  }

  const code = formData.get("code");
  const slug = code;

  const game = await db.game.findUnique({
    where: { slug },
    include: { players: true },
  });
  if (!game) {
    throw new Response(`No game found for slug: ${slug}`, {
      status: 404,
    });
  }

  const data = await db.playersInGames.create({
    data: {
      player: { connect: { id: user.id } },
      game: { connect: { id: game.id } },
      isHost: false,
    },
  });

  return redirect(`/game/${code}/lobby`);
};

export default function Join() {
  const actionData = useActionData();

  return (
    <div className="grid-container">
      <div className="item1">
        <img src={banner} className="logo" />
      </div>

      <div className="item2">
        <h5></h5>
        <Form method="post">
          <div className="form-control">
            <label>Code</label>
            <input
              type="text"
              required
              placeholder="Enter Code"
              name="code"
              id="code"
              defaultValue={actionData?.fields?.code}
            />
            <div className="error-container">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <button className="btn glow-button" type="submit">
            Next
          </button>
        </Form>
      </div>
    </div>
  );
}
