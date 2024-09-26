"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

type ExchangeRate = {
  [key: string]: number;
};

type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "PKR" | "JPY";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );

        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        setError("Error fetching exchange rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];

      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen 
        bg-[url(./images/bgimg.jpg)] bg-cover font-serif"
    >
      <Card
        className="w-full max-w-md p-4 space-y-2 rounded-3xl shadow-xl shadow-black
          ring-2 ring-white ring-offset-4 ring-offset-pink-200"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Currency Converter
          </CardTitle>
          <CardDescription className="text-lg">
            Convert between different currencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <Spinner className="w-6 h-6 text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Label htmlFor="from" className="font-bold text-lg">
                  From
                </Label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount || ""}
                    onChange={handleAmountChange}
                    className="w-full shadow-lg font-sans"
                    id="from"
                  />
                  <Select
                    value={sourceCurrency}
                    onValueChange={handleSourceCurrencyChange}
                  >
                    <SelectTrigger className="w-24 shadow-lg">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Label htmlFor="to" className="font-bold text-lg">
                  To
                </Label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <div className="text-3xl font-bold text-slate-900 font-sans">
                    {convertedAmount}
                  </div>
                  <Select
                    value={targetCurrency}
                    onValueChange={handleTargetCurrencyChange}
                  >
                    <SelectTrigger className="w-24 shadow-lg">
                      <SelectValue placeholder="EUR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full font-bold text-lg bg-slate-900 rounded-3xl shadow-lg"
            onClick={calculateConvertedAmount}
          >
            Convert
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
