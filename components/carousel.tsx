/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Link from "next/link";

interface CandidateImage {
  name: string;
  image: string;
  instagram: string;
}

interface CarouselProps {
  candidateImages: CandidateImage[];
}

const Carousel: NextPage<CarouselProps> = ({ candidateImages }) => {
  const candidates = [...candidateImages, ...candidateImages];

  return (
    <div className="absolute h-[900px] overflow-hidden whitespace-nowrap top-0 left-0 scroll z-0">
      {candidates.map((candidate, index) => (
        <Link
          href={candidate.instagram}
          key={"image" + index}
          className="remove opacity-60 md:opacity-50 hover:opacity-100 duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={candidate.image}
            alt={`${candidate.name} képe`}
            height="900px"
            style={{ height: "900px" }}
          />
        </Link>
      ))}
    </div>
  );
};

export default Carousel;
