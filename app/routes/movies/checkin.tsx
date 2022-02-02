import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async ({ request, params }) => {
  // we have movies in the db. (probably should fetch these
  // from the external API and create gameMovie entries when a user starts a game)
  // const movies = await db.movie.findMany({});

  // // we need a game: ideally this happens in an action function as a response to user "creating game"
  // const game = await db.games.create({ data: {} });

  // // we need to link the game to the movies: ideally this happens when the game starts
  // const gameMovies = await db.movieGame.createMany({
  //   data: movies.map((movie) => ({
  //     gameId: game.id,
  //     movieId: movie.id,
  //   }))
  // });

  // return gameMovies;
}
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("_method");

  // we have movies in the db. (probably should fetch these
  // from the external API and create gameMovie entries when a user starts a game)
  const movies = await db.movie.findMany({});

  // we need a game: ideally this happens in an action function as a response to user "creating game"
  const game = await db.games.create({ data: {} });

  // we need to link the game to the movies: ideally this happens when the game starts
  const gameMovies = await db.movieGame.createMany({
    data: movies.map((movie) => ({
      gameId: game.id,
      movieId: movie.id,
    }))
  });

  //return gameMovies;


  if (typeof actionType !== "string") {
    throw new Error(`No action type found in form data.`);
  }

  switch (actionType) {
    case "begin": {
      await db.movieGame.update({
        data: {
          id: { connect: { id: movie.id } },
          //game: { connect: { id: game.id } },
          totalLikes: 0,
        },
      });

      //return tasteUpdate;
      throw redirect(`movies`);
    }
    case "join": {
      console.log("Do nothing atm");
    }
    default: {
      throw json("Invalid action type.", 400);
    }
  }
};

function Checkin() {
  // const { movie } = useLoaderData();
  // const actionData = useActionData();

  return (
    <div>
      <Form method="post">
        <>
          <input type="hidden" name="_method" value="begin" />
          <button type="submit">Begin</button>
        </>
        <>
          <input type="hidden" name="_method" value="join" />
          <button type="submit">Join</button>
        </>
      </Form>
    </div>
  );
}

export default Checkin;
