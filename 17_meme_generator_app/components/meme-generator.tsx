"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";

type Meme = {
  id: string;
  name: string;
  url: string;
};

type Position = {
  x: number;
  y: number;
};

export default function MemeGenerator() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [memesVisible, setMemesVisible] = useState<Meme[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [text, setText] = useState<string>("");
  const [textPosition, setTextPosition] = useState<Position>({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const memeRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState<string>("black");
  const memesPerLoad = 4;

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      const response = await fetch("https://api.imgflip.com/get_memes");

      const data = await response.json();

      setMemes(data.data.memes);
      setMemesVisible(data.data.memes.slice(0, memesPerLoad));
      setLoading(false);
    };
    fetchMemes();
  }, []);

  const loadMoreMemes = (): void => {
    setMoreLoading(true);
    const newVisibleMemes = memes.slice(0, memesVisible.length + memesPerLoad);
    setMemesVisible(newVisibleMemes);
    setMoreLoading(false);
  };

  const handleDownload = async (): Promise<void> => {
    if (memeRef.current) {
      const canvas = await html2canvas(memeRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "meme.png";
      link.click();
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTextColor(e.target.value);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-foreground
    bg-gradient-to-l from-slate-300 via-white to-slate-300"
    >
      <div className="max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-950">
              Meme Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create custom memes with our easy-to-use generator.
            </p>
            <p className="text-muted-foreground text-lg">
              Click on the meme you want to Customize.
            </p>
          </div>
          {loading ? (
            <Spinner className="w-12 h-12 text-blue-500" />
          ) : (
            <>
              <div className="w-full overflow-x-scroll whitespace-nowrap py-2">
                {memesVisible.map((meme) => (
                  <Card
                    key={meme.id}
                    className="inline-block bg-muted rounded-lg overflow-hidden cursor-pointer 
                    transition-transform hover:scale-105 mx-2 shadow-lg"
                    onClick={() => setSelectedMeme(meme)}
                  >
                    <Image
                      src={meme.url}
                      alt={meme.name}
                      width={300}
                      height={300}
                      className="object-cover shadow-lg"
                    />
                    <CardContent>
                      <p className="text-center">{meme.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {memesVisible.length < memes.length && (
                <Button
                  onClick={loadMoreMemes}
                  className="mt-4 font-bold bg-sky-700 shadow-lg rounded-lg animate-bounce"
                  disabled={moreLoading}
                >
                  {moreLoading ? (
                    <Spinner className="w-6 h-6 text-white" />
                  ) : (
                    "Load More"
                  )}
                </Button>
              )}
            </>
          )}
          {selectedMeme && (
            <Card className="w-full max-w-md shadow-lg ring-2 ring-white ring-offset-2 ring-offset-slate-200">
              <CardHeader>
                <CardTitle>Customize Your Meme</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={memeRef}
                  className="relative bg-muted rounded-lg overflow-hidden"
                >
                  <Image
                    src={selectedMeme.url}
                    alt={selectedMeme.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full shadow-lg"
                  />
                  <Draggable
                    position={textPosition}
                    onStop={(_, data) => {
                      setTextPosition({ x: data.x, y: data.y });
                    }}
                  >
                    <div
                      className="absolute text-black text-xl font-bold"
                      style={{
                        left: textPosition.x,
                        top: textPosition.y,
                        color: textColor,
                      }}
                    >
                      {text}
                    </div>
                  </Draggable>
                </div>
                <div className="mt-4">
                  <Label htmlFor="meme-text" className="text-2xl">
                    Add your text :
                  </Label>
                  <Textarea
                    id="meme-text"
                    placeholder="Enter your meme text"
                    className="mt-1 w-full shadow-lg"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-2 text-center">
                    <br />
                    <div>Click here to change text color 👇</div>
                    <div className="flex flex-col items-center justify-center">
                      <Input
                        type="color"
                        value={textColor}
                        onChange={handleColorChange}
                        className="w-2/4 h-10 p-0 border-0 rounded-2xl cursor-pointer shadow-lg"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 font-bold bg-sky-700 shadow-lg
                rounded-xl"
                  onClick={handleDownload}
                >
                  Download Meme
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
