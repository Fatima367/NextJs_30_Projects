'use client'
import { useState, ChangeEvent } from "react"
import { Card,CardTitle, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"



export default function ColorPicker(){


    const [color, setColor] = useState <string>('#fef2f2')

    const handleColorChange = (e : ChangeEvent<HTMLInputElement>): void =>{
        setColor(e.target.value);
    }

    const copyToClipboard = ():void => {
       
        navigator.clipboard.writeText(color);
        alert("Copied to the Clipboard!")
    }

return (
    <div className="flex flex-col items-center justify-center h-screen font-serif
    bg-[url(./images/bgimg.jpg)] bg-cover bg-center">
    <Card className="w-full max-w-md mx-auto p-4 grid gap-6 ring-2 ring-yellow-50 
    ring-offset-8 ring-offset-cyan-500">
      <div className="text-center space-y-2">
        <CardTitle>Color Picker</CardTitle>
        <CardDescription>
          Select a color and copy the hex and RGB values.
        </CardDescription>
      </div>
      <div className="grid gap-2">
        <div
          className="w-full h-48 rounded-full border-4 border-gray-200 
          dark:border-gray-800 "
          style={{ backgroundColor: color }}
        />
        <div className="grid gap-2 text-center">
          <div className="text-2xl font-semibold">{color}</div>
          <div className="text-gray-500 dark:text-gray-400">
            RGB: {parseInt(color.slice(1, 3), 16)},{" "}
            {parseInt(color.slice(3, 5), 16)},{" "}
            {parseInt(color.slice(5, 7), 16)}
          </div>
          <Button
            onClick={copyToClipboard}
            variant="default"
            className="w-full rounded-3xl font-bold"
          >
            Copy to Clipboard
          </Button>
        </div>
        Click here to pick colors 👇
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-full h-16 p-0 border-0 rounded-full cursor-pointer"
        />
      </div>
    </Card>
  </div>

)

}