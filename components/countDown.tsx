import { NextPage } from "next";

interface CountDownProps {
  style: "simple" | "cards";
}

const CountDown: NextPage<CountDownProps> = ({ style }) => {
  if (style === "cards") {
    return (
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span data-time-id="d"></span>
          </span>
          nap
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span data-time-id="h"></span>
          </span>
          óra
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span data-time-id="m"></span>
          </span>
          perc
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span data-time-id="s"></span>
          </span>
          mp
        </div>
      </div>
    );
  }

  return (
    <>
      <span className="countdown font-mono text-2xl">
        <span data-time-id="d"></span>:<span data-time-id="h"></span>:
        <span data-time-id="m"></span>:<span data-time-id="s"></span>
      </span>
    </>
  );
};

export default CountDown;
