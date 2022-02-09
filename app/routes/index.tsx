// import { ActionFunction, Form, Link, LoaderFunction, redirect } from "remix";
// import { db } from "~/utils/db.server";
// import { createMovieGame } from "~/utils/movieGame.server";
// import { getPlayer, requirePlayerId } from "~/utils/session.server";

// export const loader: LoaderFunction = async ({ request }) => {
//   //const { slug } = request;
//   const data = {
//     movies: await db.movie.findMany({
//       take: 7,
//       select: { id: true, title: true },
//     }),
//   };

//   const player = await getPlayer(request);
//   return { data, player };
// };

// export const action: ActionFunction = async ({ request, params }) => {
//   const playerId = await requirePlayerId(request);
//   const game = await createMovieGame({
//     playerId,
//   });

//   // const gameId = game.id;

//   // const gameStatus = await db.game.update({
//   //   where: { id: gameId },
//   //   data: { isStarted: true },
//   // });

//   return redirect(`/game/${game.slug}/lobby`);
// };

// export default function index() {
//   return (
//     <div>
//       <Form method="post">
//         <>
//           {/* <h3>You are {player}</h3> */}
//           <input type="hidden" name="loginType" value="begin" />
//           <button className="button" type="submit">
//             Host New Game
//           </button>
//         </>
//         <br />
//         <>
//           <input type="hidden" name="loginType" value="join" />
//           <button type="submit">
//             <Link to="/join">Join game</Link>
//           </button>
//         </>
//       </Form>
//     </div>
//   );
// }

import { useActionData, redirect, json, Form } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import {
  register,
  createUserSession,
  requirePlayerId,
  getPlayer,
  getPlayerId,
} from "~/utils/session.server";

function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username must be at least 3 characters";
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const loader = async ({ request }) => {
  const player = await getPlayer(request);
  return { player };
};

export const action = async ({ request }) => {
  const form = await request.formData();
  //const loginType = form.get("loginType");
  const username = form.get("username");
  const password = "secretPassword";

  const fields = { username };

  const fieldErrors = {
    username: validateUsername(username),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  //Check if user exists
  const userExists = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (userExists) {
    return badRequest({
      fields,
      fieldErrors: { username: `User ${username} already exists` },
    });
  }

  //Create user
  const user = await register({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: "Something went wrong",
    });
  }

  //Create user sessioni
  return createUserSession(user.id, "/new");
};

export default function Enter() {
  const actionData = useActionData();

  return (
    <div>
      <div>
        <h1>Enter your name:</h1>
      </div>

      <div className="page-content">
        <Form method="post">
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div>
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
