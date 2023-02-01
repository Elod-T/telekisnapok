import { NextPage } from "next";
import CircleLoader from "react-spinners/CircleLoader";

const Loading: NextPage = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <CircleLoader color="#ffffff" size={150} />
    </div>
  );
};

export default Loading;
