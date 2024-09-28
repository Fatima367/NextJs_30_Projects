"use client";
import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { CalendarIcon, StarIcon } from "lucide-react";
import Image from "next/image";

type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [MovieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovieDetails(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4
    bg-[url(./images/bgimg.jpg)]"
    >
      <div
        className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md text-red-800
      ring-2 ring-white ring-offset-2 ring-offset-red-200"
      >
        <h1 className="text-3xl font-bold mb-1 text-center">Movie Search</h1>
        <p className="mb-6 text-center">
          Search for any movies and display details.
        </p>
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border rounded-md focus:outline-none 
            focus:ring-2 focus:ring-red-500 shadow-lg text-lg"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-gray-600
            font-bold"
          >
            Search
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <Spinner className="w-6 h-6 text-red-500" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}. Please try searching for another movie.
          </div>
        )}
        {MovieDetails && (
          <div className="flex flex-col items-center">
            <div className="w-full mb-4">
              <Image
                src={
                  MovieDetails.Poster !== "N/A"
                    ? MovieDetails.Poster
                    : "/placeholder.svg"
                }
                alt={MovieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-md mx-auto"
              />
            </div>
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-2">{MovieDetails.Title}</h2>
              <p className="text-gray-600 mb-4 italic">{MovieDetails.Plot}</p>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="mr-4">{MovieDetails.Year}</span>
                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                <span>{MovieDetails.imdbRating}</span>
              </div>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Genre:</strong> {MovieDetails.Genre}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Director:</strong> {MovieDetails.Director}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Actors:</strong> {MovieDetails.Actors}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Runtime:</strong> {MovieDetails.Runtime}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Released:</strong> {MovieDetails.Released}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
