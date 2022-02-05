import type { Game } from '@prisma/client';
//import { addSeconds } from 'date-fns';
import { nanoid } from 'nanoid';
import { json, redirect } from 'remix';
import { db } from './db.server';
import { requirePlayerId } from './session.server';

export type MovieGameData = {
  playerId: string;
  // categoryId: number;
  // questionCount: number;
};

export async function createMovieGame({ playerId }: MovieGameData): Promise<Game> {
  //const apiToken = await generateToken();
  //const questions = await getQuestions(apiToken, categoryId, questionCount);
  return db.game.create({
    data: {
      slug: nanoid(4),
      players: {
        create: [
          {
            player: { connect: { id: playerId } },
            isHost: true,
          },
        ],
      },
    },
  });
}

export async function requireGame(slug: string): Promise<Game> {
  const game = await db.game.findUnique({
    where: { slug },
  });
  if (!game) {
    throw json('Game not found.', 404);
  }
  return game;
}

// export async function answerQuestion(
//   slug: string,
//   request: Request,
// ): Promise<PlayersInMovieGamesAnswers> {
//   const playerId = await requirePlayerId(request, `/game/${slug}/play`);

// const game = await db.game.findUnique({
//   where: { slug },
//   include: {
//     players: { include: { player: { select: { username: true, id: true } } } },
//     //questions: { include: { playerAnswers: true } },
//   },
// });

// if (!game) {
//   throw json('Game not found.', 404);
// }

// const question = game.questions.find(({ position }) => position === game.currentRound);

// if (!question) {
//   throw json('No current question found.', 404);
// }

// const previousAnswer = question.playerAnswers.find(({ playerId: id }) => id === playerId);
// if (previousAnswer) {
//   throw redirect(`/trivia/${slug}/play`);
// }
// const answers = [question.correctAnswer, ...question.incorrectAnswers];
// const isValidAnswer = answers.includes(answer);
// if (!isValidAnswer) {
//   throw json(`Invalid answer, must be one of ${answers.toString()}`, 400);
// }

// save the answer
// const playerAnswer = await db.playersInMovieGamesAnswers.create({
//   data: {
//     triviaGameId: game.id,
//     playerId: playerId,
//     position: question.position,
//     answer,
//   },
// });
// update score
//   if (question.correctAnswer === answer) {
//     const score = (game.players.find(({ playerId: id }) => id === playerId)?.score ?? 0) + 1;
//     await db.playersInMovieGames.update({
//       where: { playerId_triviaGameId: { playerId, triviaGameId: game.id } },
//       data: { score },
//     });
//   }
//   return playerAnswer;
// }

// export async function handleAdvanceQuestion(slug: string, position: number, request: Request) {
//   const playerId = await requirePlayerId(request);
//   const game = await db.triviaGame.findUnique({
//     where: {
//       slug,
//     },
//     include: {
//       questions: { include: { playerAnswers: true } },
//       players: { include: { player: { select: { username: true, id: true } } } },
//     },
//   });
//   if (!game) {
//     throw json('Game not found', 404);
//   }

//   if (!game.players.some((p) => p.player.id === playerId)) {
//     throw json('You are not in this game', 403);
//   }
//   if (position !== game.currentRound) {
//     throw redirect(`/trivia/${slug}/play`);
//   }

// const questionCount = game.questions.length;
// const wasLast = game.currentRound === questionCount - 1;
// if (wasLast) {
//   await db.triviaGame.update({
//     where: { id: game.id },
//     data: {
//       endedAt: new Date(),
//     },
//   });
// } else {
//   await db.triviaGame.update({
//     where: { slug: game.slug },
//     data: {
//       currentRound: game.currentRound + 1,
//     },
//   });
//   await db.question.update({
//     where: {
//       position_triviaGameId: {
//         position: game.currentRound + 1,
//         triviaGameId: game.id,
//       },
//     },
//     data: {
//       startedAt: addSeconds(new Date(), 5),
//       endedAt: addSeconds(new Date(), 20),
//     },
//   });
// }
//throw redirect(`/trivia/${game.slug}/play`);
//}
