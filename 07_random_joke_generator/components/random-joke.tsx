'use client'
import { useState, useEffect} from "react"
import { Button } from "./ui/button"

interface JokeResponse{
    setup : string
    punchline : string
}

export default function RandomJokeComponent(){

    const [joke, setJoke ] = useState <string> ("")

    useEffect(()=> {
        fetchJoke();
    },[])

    async function fetchJoke():Promise <void> {
        try {
            const response = await fetch (
                "https://official-joke-api.appspot.com/random_joke"
            );
            const data : JokeResponse = await response.json();
            setJoke(`${data.setup} - ${data.punchline}`)
        } 
        catch (error) {
            console.error("Error fetching joke:", error);
            setJoke("Failed to fetch joke. Please try again.");
          }
    }

return (
        <div className="flex flex-col items-center justify-center h-screen
         bg-[url(./images/bgimg.jpg)] bg-cover bg-center p-2 font-mono">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md
          ring-4 ring-black ring-offset-4 shadow-gray-700
          bg-gradient-to-tl from-yellow-100 via-transparent to-yellow-50">
            <h1 className="text-3xl font-bold mb-4 text-[#333]">😂 Random Joke 👈</h1>
            <div className="bg-[#fff] ring-2 ring-red-600 rounded-lg p-6 mb-6 text-[#555] text-lg">
              {joke || "Loading..."}
            </div>
            <Button
              onClick={fetchJoke}
              className=" bg-blue-800 hover:bg-blue-400 text-white font-bold 
              py-2 px-4 rounded-full transition-colors duration-300"
            >
              Get New Joke 😂
            </Button>
          </div>
        </div>
      );
 
}