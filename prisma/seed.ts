import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await db.movie.createMany({
    data: seedMovies(),
  });
}

function seedMovies() {
  return [
    {
      title: "Test movie #1",
      overview: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #2",
      overview: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #3",
      overview: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #4",
      overview: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
    {
      title: "Test movie #5",
      overview: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum consectetur quisquam illum doloribus, veritatis quam nobis accusamus repellat obcaecati sint cum eum recusandae fuga, iure cupiditate, molestiae est error?`,
    },
  ];
}

void (async () => {
  await seed();
})();
