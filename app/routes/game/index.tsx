import { LoaderFunction, useLoaderData } from "remix";
import { requirePlayerId, getPlayer } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const data = await getPlayer(request);
  console.log(data);
  return data;
}

export default function Welcome() {
  const player = useLoaderData();


  return (
    <div>
      <h1>Welcome bud!</h1>
      <p>{player.username}</p>
    </div>);
}
