"use client";
import { useState, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface BmiResult {
  bmi: string;
  category: string;
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setHeight(e.target.value);
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWeight(e.target.value);
  };

  const calculateBmi = (): void => {
    if (!height || !weight) {
      setError("Please enter both height and weight.");
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    if (heightInMeters <= 0) {
      setError("Height must be a positive number.");
      return;
    }

    const weightInKg = parseFloat(weight);
    if (weightInKg <= 0) {
      setError("Weight must be a positive number.");
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);

    let category = "";

    if (bmiValue < 18.5) {
      category = "Underweight";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = "Normal";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    setResult({ bmi: bmiValue.toFixed(1), category });
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url(./images/bgimg.jpg)] bg-cover bg-center 
     dark:bg-gray-900 font-serif">
      <Card className="w-full max-w-md mx-auto p-4 rounded-3xl bg-gradient-to-tl from-orange-50 via-slate-50
       to-orange-50 ring-4 ring-teal-700">
        <CardHeader>
          <CardTitle className="text-4xl">BMI Calculator</CardTitle>
          <CardDescription className="text-lg">
            Enter your height and weight to calculate your BMI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="height" className="font-bold text-base">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              className="ring-2 ring-teal-700"
              value={height}
              onChange={handleHeightChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight" className="font-bold text-base">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              className="ring-2 ring-teal-700"
              value={weight}
              onChange={handleWeightChange}
            />
          </div>
          <Button 
          className="bg-teal-700 font-bold text-base"
          onClick={calculateBmi}>
            Calculate
            </Button>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {result && (
            <div className="grid gap-2">
              <div className="text-center text-2xl font-bold">{result.bmi}</div>
              <div className="text-center text-muted-foreground bg-teal-50 font-bold text-black">
                {result.category}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
