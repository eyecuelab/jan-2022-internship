import type { MovieGame } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { Link, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

type LoaderData = {
  username: string | null;
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await getUser(request);
  const data: LoaderData = {
    username: null,
  };
  if (!user) {
    return data;
  }
  return data;
};

export default function MovieIndexRoute() {
  const { username } = useLoaderData<LoaderData>();

  if (!username) {
    return (
      <div>
        <h2>My Games</h2>
        <div>
          <Link to="login">You must be logged in to play</Link>
        </div>
        <Link to="new">
          Create A Game
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>My Movies</h2>
        <br />
        <Link to="new">
          New Game
        </Link>
        <Link to="checkin">
          Checkin
        </Link>
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