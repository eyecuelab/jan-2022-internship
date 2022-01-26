import { useLoaderData } from "remix";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function writeToDB() {
  const data = useLoaderData();
  console.log("this comes from server");
  const apidata = data.results;
  console.log(typeof(apidata));
  

  apidata.map((item: any)=> {
    console.log(item.title);
    return prisma.movie.create({ 
      data: {
        title: item.title,
        plot: item.overview,
  
        //id: id,
        // title: "New Movie",
        // plot: "New Plot",
      },
    });

  })
  

  // await prisma.movie.create({
  //   data: {
  //     title: "Great Movie",
  //     plot: "Test Plot",
  //     // title: data.title,
  //     // plot: data.overview,

  //     //id: id,
  //     // title: "New Movie",
  //     // plot: "New Plot",
  //   },
  // });
}

