import { useActionData, json, redirect } from "remix";
import { db } from '~/utils/db.server'
import { login, createUserSession, register } from '~/utils/session.server'

function validateUsername(username: String) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username must be at least 3 characters";
  }
}

function validatePassword(password: String) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  }
}

function badRequest(data: ActionData) {
  return json(data, { status: 400 });
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

export async function action({ request }) {
  const form = await request.formData();
  const loginType = form.get('loginType')
  const username = form.get('username')
  const password = form.get('password')

  const fields = { loginType, username, password }

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      //Find user
      const user = await login({ username, password });
      //Check user
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: "Invalid Credentials" },
        });
      }

      //Create user session
      return createUserSession(user.id, "/movies");
    }

    case "register": {
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
      return createUserSession(user.id, "/movies");
    }
  }

  return redirect("/movies");
};
export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="container">
      <div className="page-header movie">
        <h3>Login or Register</h3>
        <label>
          <input
            type="radio"
            name="loginType"
            value="login"
            defaultChecked={
              !actionData?.fields?.loginType ||
              actionData?.fields?.loginType === "login"
            }
          />
          Login
        </label>

        <label>
          <input type="radio" name="loginType" value="register" />
          Register
        </label>
      </div>
      <br />

      <div className="page-content">
        <form action="" method="post">
          <div>
            <label htmlFor="username"><b>Username</b></label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div className="error">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
            <br />
            <label htmlFor="password"><b>Password</b></label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
            <br />
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
