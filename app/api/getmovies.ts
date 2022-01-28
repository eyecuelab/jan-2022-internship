export type Movie = {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
}

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string
  likes: Movie[];
}

export async function getMovies() {
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}`;
  
  const res = await fetch(API_URL);
  const moviesFromAPI: Movie[] = await res.json();
  return moviesFromAPI;
}