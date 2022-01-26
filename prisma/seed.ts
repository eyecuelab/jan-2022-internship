import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getMovies().map((movie) => {
      return db.movie.create({ data: movie });
    })
  );
}

seed();

function getMovies() {
  return [
    {
      title: "Test movie #1",
      plot: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #2",
      plot: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #3",
      plot: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #4",
      plot: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
  ];
}
