import type { Game } from "@prisma/client";
//import { addSeconds } from 'date-fns';
import { nanoid } from "nanoid";
import { json, redirect } from "remix";
import { db } from "./db.server";

export type MovieGameData = {
  playerId: string;
};

export async function createMovieGame({
  playerId,
}: MovieGameData): Promise<Game> {
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
    throw json("Game not found.", 404);
  }
  return game;
}
