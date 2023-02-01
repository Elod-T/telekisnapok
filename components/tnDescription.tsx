/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";

const content = [
  `A Székesfehérvári Teleki Blanka Gimnázium a megye és egyben az
    ország egyik legerősebb középfokú oktatási intézménye, amely immár
    145 éve működik. Az iskola tanulói kiváló eredményeket érnek el
    tanulmányi megmérettetéseken, kulturális- és sportversenyeken
    egyaránt, amire a gimnázium rendkívül büszke.`,
  `A Telekis Napok egy éves iskolai rendezvény az izgalom és a
    versengés időszaka, mivel a végzős osztályok egy-egy jelöltje indul
    az iskola királya rangos címért. A koronázást
    megelőző hét ünnepi dekorációkkal és szórakoztató tevékenységekkel
    telik, mivel minden nap az egyik osztályé a főszerep az iskola
    átalakításában. Ezen felül a péntek este a várva várt kampányfilmek
    nézésével telik, amelyekben a jelöltek és osztályuk bemutatkoznak
    humoros formában.`,
  ` Az koronázás napján az egész iskola összegyűlik, hogy végignézze,
    ahogy délelőtt a jelöltek kortesen vesznek részt, kihívásokat
    teljesítenek, és összegyűjtik társaik támogatását. A feszült és
    izgalmas verseny után délután megszámolják a szavazatokat, és
    megkoronázzák az új királyt, aki elnyeri a hőn áhított koronát és az
    egész iskola csodálatát.`,
];

const TNDescription: NextPage = () => {
  return (
    <div className="relative z-20 w-full bg-base-100 pt-20">
      <div className="w-5/6 md:w-2/3 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Milyen a Teleki és a TN?
        </h1>
        <div className="grid md:grid-cols-2 gap-x-4">
          <img
            src="/images/iskola.webp"
            alt="iskola kep"
            className="rounded-lg md:hidden lg:hidden mb-4"
          />
          <div className="flex flex-col gap-4">
            {content.map((item, index) => (
              <p className="text-base" key={index}>
                {item}
              </p>
            ))}
          </div>
          <img
            src="/images/iskola.webp"
            alt="iskola kep"
            className="rounded-lg hidden sm:hidden md:block lg:block"
          />
        </div>
      </div>
    </div>
  );
};

export default TNDescription;
