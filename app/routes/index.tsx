import {
  useActionData,
  json,
  Form,
  LoaderFunction,
  ActionFunction,
} from "remix";
import { register, createUserSession, getPlayer } from "~/utils/session.server";
import banner from "~/assets/svg/banner3.png";
import landingStyles from "~/styles/landing.css";
import { db } from "~/utils/db.server";

export const links = () => [{ rel: "stylesheet", href: landingStyles }];

function validateUsername(username: FormDataEntryValue | null) {
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username === null
  ) {
    //return "Username must be at least 3 characters";
    throw json("Username must be at least 3 characters", { status: 400 });
  }
}

function badRequest(data: {
  fieldErrors?: { username: string | undefined | null } | { username: string };
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

  try {
    validateUsername(username);
  } catch (e) {
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields });
    }
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
            <label htmlFor="username">
              <h4>To Get Started</h4>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Username"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
