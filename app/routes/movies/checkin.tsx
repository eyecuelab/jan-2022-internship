import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import { db } from '~/utils/db.server';

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('_method');

  if (typeof actionType !== 'string') {
    throw new Error(`No action type found in form data.`);
  }

  switch (actionType) {
    case 'begin': {
      const tasteUpdate = await db.movieGame.update({
        data: {
          id: movie.id,
          game: { connect: { id: game.id } },
          totalLikes: 0,
        },
      });
      return tasteUpdate;
      //throw redirect(`/movies/`);
    }
    case 'join': {
      console.log("Do nothing atm");

    }
    default: {
      throw json('Invalid action type.', 400);
    }
  }
}

function Checkin() {
  // const { movie } = useLoaderData();
  // const actionData = useActionData();

  return <div>
    <Form method="post">
      <>
        <input type="hidden" name="_method" value="begin" />
        <button type="submit">
          Begin
        </button>
      </>
      <>
        <input type="hidden" name="_method" value="join" />
        <button type="submit">
          Join
        </button>
      </>
    </Form>
  </div>;
}

export default Checkin;
