"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InfoIcon, MailIcon, MapPinIcon, UserIcon } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import Image from "next/image";

interface User {
  name: string;
  email: string;
  address: string;
  image: string;
  description: string;
}

const RandomUserComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appreciationVisible, setAppreciationVisible] =
    useState<boolean>(false);

  const fetchRandomUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      const fetchedUser = data.results[0];
      const newUser: User = {
        name: `${fetchedUser.name.first} ${fetchedUser.name.last}`,
        email: fetchedUser.email,
        address: `${fetchedUser.location.street.number} ${fetchedUser.location.street.name}, ${fetchedUser.location.city}, ${fetchedUser.location.country}`,
        image: fetchedUser.picture.large,
        description: fetchedUser.login.uuid,
      };
      setUser(newUser);
    } catch (err) {
      setError("Failed to fetch user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);

  const handleAppreciate = () => {
    setAppreciationVisible(true);
    setTimeout(() => setAppreciationVisible(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-foreground bg-gradient-to-b
    from-slate-100 via-white to-slate-100">
      <h1 className="text-3xl font-bold mb-2 mt-3 font-serif text-slate-800">
        Random User Generator
      </h1>
      <p className="text-muted-foreground mb-3">
        Click the button below to fetch a random user profile.
      </p>
      <Button
        onClick={fetchRandomUser}
        className="mb-4 bg-sky-600 shadow-sm hover:shadow-slate-400"
      >
        Fetch New User
      </Button>
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner className="w-6 h-6 mr-2 text-slate-400" />
          <span className="text-slate-400">Loading...</span>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {user && (
        <Card
          className="border-2 shadow-lg rounded-lg overflow-hidden max-w-sm relative mb-5
            border-t-teal-400 border-b-teal-400 border-l-cyan-400 border-r-cyan-400"
        >
          <CardHeader className="h-32 bg-[#eefffe] relative">
            <Image
              src={user.image}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-white absolute bottom-0 left-1/2 
                  transform -translate-x-1/2 translate-y-1/2 shadow-md shadow-[#c2efe3]"
            />
          </CardHeader>
          <CardContent className="p-6 pt-12 text-center">
            <CardTitle className="text-xl font-bold flex items-center justify-center">
              <UserIcon className="mr-2 text-blue-950" /> {user.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center justify-center">
              <MailIcon className="mr-2 text-orange-500" /> {user.email}
            </CardDescription>
            <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
              <MapPinIcon className="mr-2 text-red-500" /> {user.address}
            </div>
            <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
              <InfoIcon className="mr-2 text-blue-500" /> {user.description}
            </div>
            <Button
              className="mt-4 bg-sky-600 hover:bg-black shadow-md hover:shadow-slate-400"
              onClick={handleAppreciate}
            >
              Appreciate
            </Button>
          </CardContent>
          <CSSTransition
            in={appreciationVisible}
            timeout={300}
            classNames="appreciation"
            unmountOnExit
          >
            <div
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center
                 bg-slate-100 bg-opacity-75"
            >
              <h2 className="text-2xl font-bold text-black bg-slate-100 font-serif">
                ❤️ Thank you ✨
              </h2>
            </div>
          </CSSTransition>
        </Card>
      )}
    </div>
  );
};

export default RandomUserComponent;
