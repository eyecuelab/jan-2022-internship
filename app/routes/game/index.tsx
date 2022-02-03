import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

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

export default function DisplayMovies() {
  const { ...data } = useLoaderData();
  const code = data.games[0].slug;

  return (
    <>
      <div>
        <h3>The game token is - {code} - Share it with friends.</h3>
      </div>

      {/* <div className="page-header">
        <h1>Movies</h1>
        <Link to="/game/">
          The Game is On
        </Link>
      </div>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={movie.id}>
              <h3>{movie.title}</h3>
            </Link>
          </li>
        ))}
      </ul> */}
    </>
  );
}



// //import type { TriviaCategory, TriviaGame } from '@prisma/client';
// import type { LoaderFunction } from 'remix';
// import { Link, useLoaderData } from 'remix';
// import { formatRelativeDate } from '~/utils/date';
// import { db } from '~/utils/db.server';
// import { getPlayer } from '~/utils/session.server';

// type LoaderData = {
//   // pastGames: (TriviaGame & { category: TriviaCategory | null })[];
//   // currentGames: (TriviaGame & { category: TriviaCategory | null })[];
//   // upcomingGames: (TriviaGame & { category: TriviaCategory | null })[];
//   username: string | null;
// };

// export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
//   const player = await getPlayer(request);
//   const data: LoaderData = {
//     // pastGames: [],
//     // currentGames: [],
//     // upcomingGames: [],
//     username: null,
//   };
//   if (!player) {
//     return data;
//   }
//   data.username = player.username;
//   const games = await db.game.findMany({
//     where: {
//       participants: {
//         // some: {
//         //   username: {
//         //     username: player.username,
//         //   },
//         // },
//       },
//     },
//     // include: {
//     //   category: true,
//     // },
//     orderBy: {
//       updatedAt: 'desc',
//     },
//   });

//   games.forEach((game) => {
//     //   if (game.endedAt) {
//     //     data.pastGames.push(game);
//     //   } else if (game.startedAt) {
//     //     data.currentGames.push(game);
//     //   } else {
//     //     data.upcomingGames.push(game);
//     //   }
//     // });
//     return data;
//   });

//   return data
// }

// export default function MovieIndexRoute() {
//   const { username } = useLoaderData<LoaderData>();

//   // const numberOfGames = pastGames.length + currentGames.length + upcomingGames.length;

//   if (!username) {
//     return (
//       <div>
//         <h2>My Games</h2>
//         <div className="to-login">
//           <Link to="/login">You must be logged in to view your games</Link>
//         </div>
//         <Link to="new">
//           Create A Game
//         </Link>
//       </div>
//     );
//   }

//   if (username) {
//     return (
//       <div>
//         <h2>My Games</h2>
//         <br />
//         <p>You have no games</p>
//         <Link to="new" className="button link-button">
//           Create A Game
//         </Link>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <div>
//         <h2>My Games</h2>
//         <br />
//         <Link to="new">
//           Create A Game
//         </Link>
//       </div>
//       {currentGames.length > 0 && (
//         <>
//           <h3>
//             Current Games <small>{currentGames.length}</small>
//           </h3>
//           <ul>
//             {currentGames.map(({ slug, startedAt }) => (
//               <li key={slug}>
//                 <Link to={`${slug}/play`}>{`Category: ${category?.name ?? 'none'}, started: ${startedAt ? formatRelativeDate(startedAt) : ''
//                   }`}</Link>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//       {upcomingGames.length > 0 && (
//         <>
//           <h3>
//             Upcoming Games <small>{upcomingGames.length}</small>
//           </h3>
//           <ul>
//             {upcomingGames.map(({ slug, category, createdAt }) => (
//               <li key={slug}>
//                 <Link to={`${slug}/lobby`}>{`Category: ${category?.name ?? 'none'}, created: ${formatRelativeDate(
//                   createdAt
//                 )}`}</Link>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//       {pastGames.length > 0 && (
//         <>
//           <h3>
//             Past Games <small>{pastGames.length}</small>
//           </h3>
//           <ul>
//             {pastGames.map(({ slug, category, endedAt }) => (
//               <li key={slug}>
//                 <Link to={`${slug}/results`}>{`Category: ${category?.name ?? 'none'}, ended: ${endedAt ? formatRelativeDate(endedAt) : ''
//                   }`}</Link>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// }

//   // export function ErrorBoundary({ error }: { error: Error }) {
//   //   return (
//   //     <div className="error-container">
//   //       <pre>{error.message}</pre>
//   //     </div>
//   //   );
//   // }

