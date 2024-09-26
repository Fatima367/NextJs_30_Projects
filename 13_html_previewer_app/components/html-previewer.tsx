"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { predefinedHtml } from "./predefinedHtml";

export default function HtmlPreviewer() {
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");

  const handlePreview = (): void => {
    setPreviewHtml(htmlCode);
  };

  const handlePasteHtml = (): void => {
    setHtmlCode(predefinedHtml);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setHtmlCode(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground
    bg-gradient-to-br from-cyan-100 via-white to-cyan-100 ">
      <div className="w-full max-w-2xl p-4 rounded-3xl shadow-xl bg-card ring-4 ring-white ring-offset-2 
      ring-offset-cyan-200 ">
        <h1 className="text-2xl font-bold mb-4 text-center">HTML Previewer</h1>
        <p className="text-muted-foreground mb-4 text-center">
          Enter your HTML code and see the preview.
        </p>
        <div className="grid gap-4">
          <Textarea
            value={htmlCode}
            onChange={handleChange}
            placeholder="Enter your HTML code here..."
            className="p-4 rounded-lg border border-input bg-background text-foreground shadow-md"
            rows={4}
          />
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Button onClick={handlePreview} className="font-bold bg-cyan-900 shadow-md">
                Generate Preview
                </Button>
              <Button onClick={handlePasteHtml} className="font-bold bg-cyan-900 shadow-md">
                Paste HTML
                </Button>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-input bg-background text-foreground shadow-md">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
}
