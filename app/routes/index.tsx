import { Link } from "remix";

export default function index() {
  return <div>
    <ul>
      <li><Link to="/game">Start the game</Link></li>
      <li><Link to="/game">Join the game</Link></li>
    </ul>
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

