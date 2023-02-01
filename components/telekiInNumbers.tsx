/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";

const TelekiInNumbers: NextPage = () => {
  return (
    <div className="bg-base-100 pt-16">
      <div className="w-5/6 md:w-2/3 mx-auto">
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <img
                src="/school.svg"
                className="sepia-0"
                alt="Iskola svg"
                height={40}
                width={40}
              />
            </div>
            <div className="stat-title opacity-75">Iskola kora</div>
            <div className="stat-value text-primary">145 év</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <img
                src="/student.svg"
                className="sepia-0"
                alt="Diák svg"
                height={40}
                width={40}
              />
            </div>
            <div className="stat-title opacity-75">Összes diák</div>
            <div className="stat-value text-primary">15E+</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <img
                src="/teacher.svg"
                className="sepia-0"
                alt="Tanár svg"
                height={40}
                width={40}
              />
            </div>
            <div className="stat-title opacity-75">Összes tanár</div>
            <div className="stat-value text-primary">600+</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <img
                src="/trophy.svg"
                className="sepia-0"
                alt="Trófea svg"
                height={40}
                width={40}
              />
            </div>
            <div className="stat-title opacity-75">Versenyeredmény</div>
            <div className="stat-value text-primary">10E+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelekiInNumbers;
