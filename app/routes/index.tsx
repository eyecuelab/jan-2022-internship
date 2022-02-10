import {
  useActionData,
  redirect,
  json,
  Form,
  LoaderFunction,
  ActionFunction,
} from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import {
  register,
  createUserSession,
  requirePlayerId,
  getPlayer,
  getPlayerId,
} from "~/utils/session.server";
import banner from "~/assets/svg/banner3.png";

function validateUsername(username: string | any[]) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username must be at least 3 characters";
  }
}

function badRequest(data: {
  fieldErrors?: { username: string | undefined } | { username: string };
  fields: { username: any };
  formError?: string;
}) {
  return json(data, { status: 400 });
}

export const loader: LoaderFunction = async ({ request }) => {
  const player = await getPlayer(request);
  return { player };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
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
    <div className="grid-container">
      <div className="item1">
        <img src={banner} className="logo" />
      </div>

      <div className="item2">
        <h5></h5>
        <Form method="post">
          <div className="form-control">
            <label htmlFor="username">Get Started</label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div>
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <button className="btn glow-button" type="submit">
            Start
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
