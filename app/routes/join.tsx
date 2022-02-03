import { Form } from "remix";


export default function Join() {
  return (
    <form method="post" action="/game/<slug>">
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
