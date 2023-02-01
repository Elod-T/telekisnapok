import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CountDown from "./countDown";

interface HeroProps {
  voteBegin: Date;
  voteEnd: Date;
  year: string;
  adjectives: string[];
}

const Hero: NextPage<HeroProps> = ({
  voteBegin,
  voteEnd,
  year,
  adjectives,
}) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    adjectives.sort(() => Math.random() - 0.5);
    setLoaded(true);
  }, [adjectives]);

  function handleClick() {
    if (voteEnd < new Date()) {
      router.push("/dashboard");
      return;
    }

    const classes = document.getElementById("classes");

    if (!classes) return;

    const dimensions = classes.getBoundingClientRect();

    window.scrollTo({
      top: dimensions.top + window.scrollY - 100,
      behavior: "smooth",
    });
  }

  function getButtonText() {
    if (voteEnd < new Date()) {
      return "Eredmény";
    }
    if (voteBegin < new Date()) {
      return "Szavazás";
    }

    return "Osztályok";
  }

  if (!loaded) return <></>;

  return (
    <main className="relative z-10 hero md:w-fit mx-auto bg-base-100 bg-opacity-50 mt-14 md:mt-44 md:bg-opacity-75 md:px-[50px] pt-20 pb-40 md:py-4 rounded-lg">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold">Telekis Napok {year}</h1>
          <p className="py-6">
            A {adjectives[0]}, a {adjectives[1]}, a {adjectives[2]} vagy a{" "}
            {adjectives[3]} csapatába tartozol? A szavazás ekkor{" "}
            <strong>{voteBegin < new Date() ? "ér véget" : "kezdődik"}</strong>:
          </p>
          <div className="grid place-content-center">
            <CountDown style="cards" />
          </div>
          <button
            id="votebtn"
            className="btn btn-primary mt-4"
            onClick={handleClick}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
