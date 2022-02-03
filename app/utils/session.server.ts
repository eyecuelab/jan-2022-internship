// import bcrypt from "bcrypt";
// import { Movie, User } from "@prisma/client";
// import type { Session } from "remix";
// import { db } from "./db.server";
// import { createCookieSessionStorage, redirect } from "remix";

// type LoginForm = {
//   username: string;
//   password: string;
// };

// //login user
// export async function login({
//   username,
//   password,
// }: LoginForm): Promise<User | null> {
//   const user = await db.user.findUnique({
//     where: {
//       username,
//     },
//   });

//   if (!user) return null;

//   //check password
//   const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

//   if (!isCorrectPassword) return null;

//   return user;
// }

// //Register new user
// export async function register({
//   username,
//   password,
// }: LoginForm): Promise<User> {
//   const passwordHash = await bcrypt.hash(password, 10);
//   return db.user.create({
//     data: {
//       username,
//       passwordHash,
//     },
//   });
// }

// //Get session secret
// const sessionSecret = process.env.SESSION_SECRET;
// if (!sessionSecret) {
//   throw new Error("No session secret");
// }

// //Create session storage
// const storage = createCookieSessionStorage({
//   cookie: {
//     name: "movie_remix_session",
//     secure: process.env.NODE_ENV === "production",
//     secrets: [sessionSecret],
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 60,
//     httpOnly: true,
//   },
// });

// //Create session
// export async function createUserSession(playerId: string, redirectTo: string) {
//   const session = await storage.getSession();
//   session.set("playerId", playerId);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await storage.commitSession(session),
//     },
//   });
// }

// //Get user session
// export function getPlayerSession(request: Request) {
//   return storage.getSession(request.headers.get("Cookie"));
// }

import type { User } from "@prisma/client";
import type { Session } from "remix";
import { createCookieSessionStorage, redirect } from "remix";
import bcrypt from "bcrypt";
import { db } from "./db.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function login({
  username,
  password,
}: LoginForm): Promise<User | null> {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return null;
  }
  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) {
    return null;
  }
  return user;
}

export async function register({
  username,
  password,
}: LoginForm): Promise<User> {
  const user = await db.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  return user;
}

// Session Management
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "MovieSession",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function getPlayerSession(request: Request): Promise<Session> {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getPlayerId(request: Request): Promise<string | null> {
  const session = await getPlayerSession(request);
  const playerId = session.get("playerId");
  if (!playerId || typeof playerId !== "string") {
    return null;
  }
  return playerId;
}

export async function getPlayer(request: Request): Promise<User | null> {
  const playerId = await getPlayerId(request);
  if (!playerId) {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: playerId } });
    return user;
  } catch (e) {
    console.error(e);
    throw logout(request);
  }
}

export async function requirePlayerId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const session = await getPlayerSession(request);
  const playerId = session.get("playerId");
  if (!playerId || typeof playerId !== "string") {
    const searchPrams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchPrams}`);
  }
  return playerId;
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<User> {
  const playerId = await requirePlayerId(request, redirectTo);
  const user = await db.user.findUnique({ where: { id: playerId } });
  if (!user) {
    const searchPrams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchPrams}`);
  }
  return user;
}

// export async function requireUserOfGame(
//   gameId: string,
//   request: Request,
//   redirectTo: string = new URL(request.url).pathname
// ): Promise<UsersInMovieGames> {
//   const user = await requireUser(request, redirectTo);
//   const userInGame = await db.usersInMovieGames.findUnique({
//     where: { playerId_movieGameId: { playerId: user.id, movieGameId: gameId } },
//   });
//   if (!userInGame) {
//     const searchPrams = new URLSearchParams([['redirectTo', redirectTo]]);
//     throw redirect(`/login?${searchPrams}`);
//   }
//   return userInGame;
// }

export async function createUserSession(playerId: string, redirectTo: string) {
  const session = await storage.getSession(playerId);
  session.set("playerId", playerId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
