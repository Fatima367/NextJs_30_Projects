"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

interface AudioPlayerComponentProps {}

interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayerComponent: React.FC<AudioPlayerComponentProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground
    bg-gradient-to-bl from-green-950 via-gray-950 to-green-950">
      <div className="max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif text-green-500">Audio Player</h1>
          <div className="bg-gray-950 shadow-sm shadow-green-500 rounded-2xl p-2 hover:bg-white">
          <label className="flex items-center cursor-pointer">
            <UploadIcon className="w-5 h-5 mr-2 text-green-500" />
            <span className="text-green-500">Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
          </div>
        </div>
        <Card className="shadow-md shadow-green-500 bg-gray-950">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
            <Image
              src={"/image.jpg"}
              alt="Album Cover"
              width={100}
              height={100}
              className={`rounded-full w-32 h-32 object-cover ring-2 ring-white shadow-md
              shadow-green-500 ${isPlaying ? "animate-beat" : "" }`}

            />
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-600">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-muted-foreground">
                {tracks[currentTrackIndex]?.artist || "Person Name"}
              </p>
            </div>
            <div className="w-full">
              <Progress value={progress} className="shadow-sm shadow-green-500"/>
              <br />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span> {formatTime(currentTime)} </span> 
                <span className="justify-end"> {formatTime(duration)} </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant={"ghost"} size={"icon"} onClick={handlePrevTrack}>
                <RewindIcon className="w-6 h-6 text-green-500" />
              </Button>
              <Button variant={"ghost"} size={"icon"} onClick={handlePlayPause}>
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-green-500" />
                )}
              </Button>
              <Button variant={"ghost"} size={"icon"} onClick={handleNextTrack}>
                <ForwardIcon className="w-6 h-6 text-green-500" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioPlayerComponent;
