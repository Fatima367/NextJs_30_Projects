"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";

interface URLShortenerComponentProps {}

const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";
const BITLY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_BITLY_ACCESS_TOKEN;

const URLShortenerComponent: React.FC<URLShortenerComponentProps> = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(
        BITLY_API_URL,
        {
          long_url: longUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShortUrl(response.data.link);
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Successfully Copied the Short URL!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br
    from-slate-950 via-slate-700 to-slate-950">
      <div className="max-w-md w-full space-y-4 p-6 rounded-lg bg-slate-900
      ring-1 ring-blue-300 shadow-lg shadow-slate-950">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">URL Shortener</h1>
          <p className="text-white">
            Paste your long URL and get a short, shareable link.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="pr-16 bg-white w-8/12  ring-1 ring-slate-950"
              required
            />

            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 -mr-2 bg-cyan-600 hover:bg-blue-800
              ring-1 ring-cyan-200 "
            >
              Shorten URL
            </Button>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {shortUrl && (
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="cursor-pointer bg-white w-9/12  ring-1 ring-slate-950"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted/50"
                onClick={handleCopy}
              >
                <CopyIcon className="w-5 h-5 text-cyan-100" />
                <span className="sr-only"> Copy URL</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default URLShortenerComponent;
