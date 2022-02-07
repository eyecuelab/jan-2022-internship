import { useActionData, redirect, json } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import { register, createUserSession, requirePlayerId, getPlayer, getPlayerId } from "~/utils/session.server";

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
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = "secretPassword";

  const fields = { loginType, username };

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
  return createUserSession(user.id, "/");
}



export default function Enter() {
  const actionData = useActionData();

  return (
    <div>
      <div>
        <h1>Enter your name:</h1>
      </div>

      <div className="page-content">
        <form method="POST">

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
        </form>
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

