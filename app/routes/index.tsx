import { ActionFunction, Form, Link, redirect, useLoaderData, useParams } from "remix";
import { db } from "~/utils/db.server";
import { createMovieGame } from "~/utils/movieGame.server";
import { requirePlayerId } from "~/utils/session.server";

export const loader = async () => {
  const data = {
    movies: await db.movie.findMany({
      take: 7,
      select: { id: true, title: true },
    }),

    games: await db.game.findMany({
      take: 2,
      select: { id: true, slug: true },
    }),
  };

  console.log(data);
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const playerId = await requirePlayerId(request);
  console.log(playerId);


  const form = await request.formData();

  const game = await createMovieGame({
    playerId
  });

  return redirect(`/game/${game.slug}/lobby`);
};
// export const action: ActionFunction = async ({ request, params }) => {
//   const { slug } = params;
//   const form = await request.formData();
//   const user = await requirePlayer(request);
//   const game = await db.game.findUnique({
//     where: { slug },
//     //include: { players: true },
//   });
//   if (!game) {
//     throw new Error(`No game found for slug: ${params.slug}`);
//   }

//   const actionType = form.get('_method');

//   if (typeof actionType !== 'string') {
//     throw new Error(`No action type found in form data.`);
//   }

//   switch (actionType) {
//     case 'join': {
//       await db.players.create({
//         data: {
//           player: { connect: { id: user.id } },
//           game: { connect: { id: game.id } },
//           isHost: false,
//         },
//       });
//       throw redirect(`/movie/${slug}/lobby`);
//     }
//     case 'begin': {
//       const isHost = game.players.some(({ playerId, isHost }) => playerId === user.id && isHost);
//       if (!isHost) {
//         throw new Error(`You are not the host of this game.`);
//       }
//       await db.game.update({ where: { slug }, data: { startedAt: new Date(), currentQuestion: 0 } });
//       await db.question.update({
//         where: { position_triviaGameId: { position: 0, triviaGameId: game.id } },
//         data: { startedAt: addSeconds(new Date(), 5), endedAt: addSeconds(new Date(), 20) },
//       });

//       throw redirect(`/game/${slug}/play`);
//     }
//     default: {
//       throw json('Invalid action type.', 400);
//     }
//   }
// };

export default function index() {
  // const { ...data } = useLoaderData();

  //const code = data.games[0].slug;

  return <div>

    <Form method="post">
      <>
        <input type="hidden" name="_method" value="begin" />
        <button className="button" type="submit">
          Start the game
        </button>
      </>
      <br />
      <>
        <input type="hidden" name="_method" value="join" />
        <button type="submit">
          Join the game
        </button>
      </>
    </Form>
    {/* <ul>
      <li><Link to={`/game/${code}/lobby`}>Start the game</Link></li>
      <li><Link to="/join">Join the game</Link></li>
      <li><Link to="/auth/login">Login</Link></li>
    </ul> */}

  </div>;
}



















// import type { Player, TriviaCategory, TriviaGame } from '@prisma/client';
// import type { LinksFunction, LoaderFunction } from 'remix';
// import { useLoaderData } from 'remix';
// import { Link, Outlet } from 'remix';
// import { formatRelativeDate } from '~/utils/date';
// import { db } from '~/utils/db.server';
// import { getPlayer } from '~/utils/session.server';




// type LoaderData = {
//   liveGames: Array<Pick<TriviaGame, 'slug' | 'startedAt'> & { category: TriviaCategory | null }>;
//   user: Player | null;
// };
// export const loader: LoaderFunction = async ({ request }) => {
//   // const gameIsLive = { startedAt: { not: null }, endedAt: null };

//   // const liveGameCount = await db.triviaGame.count({
//   //   where: gameIsLive,
//   // });

//   // const take = Math.min(liveGameCount, 5);

//   // const liveGames = await db.triviaGame.findMany({
//   //   select: { slug: true, startedAt: true, category: true },
//   //   where: gameIsLive,
//   //   take,
//   //   orderBy: { startedAt: 'desc' },
//   // });

//   const liveGames = 5;
//   const user = await getPlayer(request);

//   const data: LoaderData = { liveGames, user };
//   return data;
// };

// export default function TriviaRoute() {
//   const { liveGames, user } = useLoaderData<LoaderData>();

//   return (
//     <div>
//       <header>
//         <div>
//           {user ? (
//             <div>
//               <div>
//                 <span>{`Hi, ${user.username}`}</span>
//                 <Link to="/game" title="My Games">
//                   <span>your games</span>
//                 </Link>
//               </div>
//               <form action="/logout" method="post">
//                 <button type="submit" className="button">
//                   Logout
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div>
//               <Link to="/login">Login</Link>
//             </div>
//           )}
//         </div>
//       </header>
//       <main>
//         <div>
//           <div>
//             <Outlet />
//           </div>
//           <div>
//             <p>Here are some live games:</p>
//             <ul>
//               {liveGames.length > 0 ? (
//                 liveGames.map(({ slug, category, startedAt }) => (
//                   <li key={slug}>
//                     <Link to={`/trivia/${slug}/play`} className="live-game-link">
//                       <span>{`Category: ${category?.name ?? 'none'}`} </span>
//                       <small>{`started: ${startedAt ? formatRelativeDate(startedAt) : ''}`}</small>
//                     </Link>
//                   </li>
//                 ))
//               ) : (
//                 <li>
//                   <em>No games are currently live.</em>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

