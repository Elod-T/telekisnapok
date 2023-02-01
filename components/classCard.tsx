import ClassWithContent from "@interfaces/classWithContent";
import { NextPage } from "next";
import Link from "next/link";

interface ClassCardProps {
  _class: ClassWithContent;
}

const ClassCard: NextPage<ClassCardProps> = ({ _class }) => {
  return (
    <Link
      className="card bg-base-200 w-screen md:w-96"
      href={`/manager/${_class.id}/edit`}
    >
      <div className="card-body bg-base-200 rounded-lg p-4 ">
        <h2 className="card-title">
          {_class.Content.candidateName} és a {_class.name}
        </h2>
        <p>{_class.Content.shortIntroduction}</p>
      </div>
    </Link>
  );
};

export default ClassCard;
