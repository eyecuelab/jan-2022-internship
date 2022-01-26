import { useLoaderData } from "remix";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function writeToDB() {
  const data = useLoaderData();
  console.log(data);

  await prisma.movie.create({
    data: {
      title: "Another Test Movie",
      plot: "Test Plot",
      // title: data.title,
      // plot: data.overview,

      //id: id,
      // title: "New Movie",
      // plot: "New Plot",
    },
  });
}

