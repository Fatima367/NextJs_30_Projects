"use client";
import { useState, ChangeEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";

const conversionRates: Record<string, Record<string, number>> = {
  length: {
    "Millimeters (mm)": 1,
    "Centimeters (cm)": 10,
    "Meters (m)": 1000,
    "Kilometers (km)": 1000000,
    "Inches (in)": 25.4,
    "Feet (ft)": 304.8,
    "Yards (yd)": 914.4,
    "Miles (mi)": 1609344,
  },
  weight: {
    "Grams (g)": 1,
    "Kilograms (kg)": 1000,
    "Ounces (oz)": 28.3495,
    "Pounds (lb)": 453.592,
  },
  volume: {
    "Milliliters (ml)": 1,
    "Liters (l)": 1000,
    "Fluid Ounces (fl oz)": 29.5735,
    "Cups (cup)": 240,
    "Pints (pt)": 473.176,
    "Quarts (qt)": 946.353,
    "Gallons (gal)": 3785.41,
  },
};

const unitTypes: Record<string, string[]> = {
  length: [
    "Millimeters (mm)",
    "Centimeters (cm)",
    "Meters (m)",
    "Kilometers (km)",
    "Inches (in)",
    "Feet (ft)",
    "Yards (yd)",
    "Miles (mi)",
  ],
  weight: ["Grams (g)", "Kilograms (kg)", "Ounces (oz)", "Pounds (lb)"],
  volume: [
    "Milliliters (ml)",
    "Liters (l)",
    "Fluid Ounces (fl oz)",
    "Cups (cup)",
    "Pints (pt)",
    "Quarts (qt)",
    "Gallons (gal)",
  ],
};

export default function UnitConversionComponent() {
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [inputUnit, setInputUnit] = useState<string | null>(null);
  const [outputUnit, setOutputUnit] = useState<string | null>(null);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(parseFloat(e.target.value));
  };

  const handleInputUnitChange = (value: string): void => {
    setInputUnit(value);
  };

  const handleOutputUnitChange = (value: string): void => {
    setOutputUnit(value);
  };

  const convertValue = (): void => {
    if (inputValue !== null && inputUnit && outputUnit) {
      let unitCategory: string | null = null;

      for (const category in unitTypes) {
        if (
          unitTypes[category].includes(inputUnit) &&
          unitTypes[category].includes(outputUnit)
        ) {
          unitCategory = category;
          break;
        }
      }

      if (unitCategory) {
        const baseValue = inputValue * conversionRates[unitCategory][inputUnit];
        const result = baseValue / conversionRates[unitCategory][outputUnit];
        setConvertedValue(result);
      } else {
        setConvertedValue(null);
        alert("Please fill all fields.");
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900
  "
      style={{
        backgroundImage:
          "linear-gradient(to right, #06b6d4, transparent 2px),linear-gradient(to bottom, #06b6d4, transparent 2px)",
        backgroundSize: "20px 20px",
        color: "black",
        minHeight: "100vh",
      }}
    >
      <div
        className="max-w-md w-full p-4 bg-card rounded-3xl shadow-2xl ring-2 ring-sky-500 ring-offset-4 
      ring-offset-sky-100"
      >
        <h1 className="text-2xl font-bold mb-1 text-center">Unit Converter</h1>
        <p className="text-sm mb-8 text-center">
          Convert values between different units.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-unit" className="font-bold text-base">
              From
            </Label>
            <Select onValueChange={handleInputUnitChange}>
              <SelectTrigger
                className="shadow-lg ring-2 ring-sky-500 ring-offset-2
      ring-offset-sky-100"
              >
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitTypes).map(([category, units]) => (
                  <SelectGroup key={category}>
                    <SelectLabel>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectLabel>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-unit" className="font-bold text-base">
              To
            </Label>
            <Select onValueChange={handleOutputUnitChange}>
              <SelectTrigger
                className="shadow-lg ring-2 ring-sky-500 ring-offset-2
      ring-offset-sky-100"
              >
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitTypes).map(([category, units]) => (
                  <SelectGroup key={category}>
                    <SelectLabel>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectLabel>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="input-value" className="font-bold text-base">
              Value
            </Label>
            <Input
              id="input-value"
              type="number"
              placeholder="Enter value"
              value={inputValue || ""}
              onChange={handleInputChange}
              className="w-full shadow-lg ring-2 ring-sky-500 ring-offset-2 ring-offset-sky-100"
            />
          </div>
          <Button
            type="button"
            className="col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
            ring-2 ring-sky-200 font-bold rounded-3xl mt-3 shadow-lg"
            onClick={convertValue}
          >
            Convert
          </Button>
        </div>
        <div className="mt-6 text-center">
          <div className="text-4xl font-bold">
            {convertedValue !== null ? convertedValue.toFixed(2) : "0"}
          </div>
          <div className="text-muted-foreground">
            {outputUnit ? outputUnit : "Unit"}
          </div>
        </div>
      </div>
    </div>
  );
}
