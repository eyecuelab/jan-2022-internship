import { LoaderFunction, Outlet, useLoaderData } from "remix";
import { requirePlayerId, getPlayer } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const data = await getPlayer(request);
  console.log(data);
  return data;
};

export default function Welcome() {
  const player = useLoaderData();

  return (
    <>
      <Outlet />
    </>
  );
}
