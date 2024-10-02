"use client";

import { ChangeEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function WordCounter() {
  const [text, setText] = useState<string>("");

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const clearText = () => {
    setText("");
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;

  const charCount = text.length;

  return (
    <div
      className="h-screen gap-4 flex flex-col justify-center items-center bg-gradient-to-bl
       from-purple-200 via-blue-100 to-purple-200"
    >
      <Card className="w-11/12 mr-5 ml-5 ring-2 ring-white
       ring-offset-2 ring-offset-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-blue-950"> Text Analysis</CardTitle>
          <CardDescription className="text-base">
            Enter text and see the word and character count.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="text-input"
            placeholder="Enter your text here..."
            className="resize-none h-28 ring-2 ring-slate-100 shadow-md"
            value={text}
            onChange={handleTextChange}
          />
          <br />
          <div className="flex justify-between items-center">
            <div className="text-xl">
              <span
                id="word-count"
                className="font-bold text-2xl text-blue-950"
              >
                {wordCount}
              </span>{" "}
              words,{" "}
              <span
                id="char-count"
                className="font-bold text-2xl text-blue-950"
              >
                {charCount}
              </span>{" "}
              characters
            </div>
            <Button
              onClick={clearText}
              className="ml-auto shadow-lg font-bold
              bg-blue-700 ring-2 ring-slate-200">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
