import { Form, redirect } from "remix";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code");

  return redirect(`/game/${code}/lobby`);
};

export default function Join() {
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
