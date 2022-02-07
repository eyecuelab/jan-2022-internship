import { redirect, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import { getPlayerId, requirePlayerId, requireUser } from "~/utils/session.server";



export const action = async ({ request, params }) => {
  const formData = await request.formData();
  // const user = await requireUser(request);
  // console.log(user.id);

  const user = await requireUser(request);
  if (!user) {
    return null;
  }

  console.log(user.id);


  const code = formData.get("code");
  const slug = code;


  const game = await db.game.findUnique({
    where: { slug },
    include: { players: true },
  });
  if (!game) {
    throw new Error(`No game found for slug: ${slug}`);
  }

  console.log(game);


  const data = await db.playersInGames.create({
    data: {
      player: { connect: { id: user.id } },
      game: { connect: { id: game.id } },
      isHost: false,
    },
  })

  return redirect(`/game/${code}/lobby`);
};

export default function Join() {
  const data = useActionData();
  //console.log(data);


  return (
    <form method="post">
      <p>
        <label>
          Enter the code: <input name="code" type="text" />
        </label>
      </p>
      <p>
        <label>
          Let's Go!
          <br />
          <text name="description" />
        </label>
      </p>
      <p>
        <button type="submit">Join!</button>
      </p>
    </form>
  );
}
