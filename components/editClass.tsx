import { NextPage } from "next";
import { useState } from "react";
import ClassData from "@interfaces/classData";
import { fileToBase64 } from "@utils/base64";

interface ClassFormProps {
  data: ClassData;
  onSave: (_class: Partial<ClassData>) => void;
}

const EditClass: NextPage<ClassFormProps> = ({ data, onSave }) => {
  const [name, setName] = useState<string>(data?.name || "");
  const [adjective, setAdjective] = useState<string>(data?.adjective || "");
  const [candidateName, setCandidateName] = useState<string>(
    data?.candidateName || ""
  );
  const [candidateImage, setCandidateImage] = useState<string>("");
  const [managers, setManagers] = useState<string[]>(data?.managers || []);
  const [shortIntroduction, setShortIntroduction] = useState<string>(
    data?.shortIntroduction || ""
  );
  const [description, setDescription] = useState<string>(
    data?.description || ""
  );
  const [instagram, setInstagram] = useState<string>(
    data?.instagram || "https://www.instagram.com/"
  );

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  function handleCandidateNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCandidateName(e.target.value);
  }

  function handleAdjectiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdjective(e.target.value);
  }

  function handleManagersChange(e: React.ChangeEvent<HTMLInputElement>) {
    setManagers(e.target.value.split(","));
  }

  function handleShortIntroductionChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setShortIntroduction(e.target.value);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }

  function handleInstagramChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInstagram(e.target.value);
  }

  function handleCandidateImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;

    fileToBase64(e.target.files[0]).then((base64) => {
      setCandidateImage(base64);
    });
  }

  function handleSave() {
    onSave({
      name,
      adjective,
      candidateName,
      candidateImage,
      managers,
      shortIntroduction,
      description,
      instagram,
    });
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-x-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Osztály</span>
          </label>
          <input
            type="text"
            placeholder="pl.: 12.X"
            className="input input-bordered"
            onChange={handleNameChange}
            value={name}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Jelölt neve</span>
          </label>
          <input
            type="text"
            placeholder="pl.: John Doe"
            className="input input-bordered"
            onChange={handleCandidateNameChange}
            value={candidateName}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Jelölt fényképe</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered"
            onChange={handleCandidateImageChange}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Jelző (T/3)</span>
          </label>
          <input
            type="text"
            placeholder="pl.: szakácsok"
            className="input input-bordered"
            onChange={handleAdjectiveChange}
            value={adjective}
          />
        </div>

        <div className="form-control ">
          <label className="label">
            <span className="label-text">
              Managerek <span className="underline">iskolai</span> email címei{" "}
              <span
                className="tooltip tooltip-info link"
                data-tip="Az adott osztály azon tagjai, akik tudják módosítani az osztály oldalát, illetve újabb managereket vehetnek fel a saját osztályukhoz."
              >
                ?
              </span>{" "}
            </span>
          </label>
          <input
            type="text"
            placeholder="pl.: gipsz.jakab@sztbg.hu, jozsef.attila@sztbg.hu"
            className="input input-bordered"
            onChange={handleManagersChange}
            value={managers.join(",")}
          />
        </div>

        <div className="form-control ">
          <label className="label">
            <span className="label-text">Instagram</span>
          </label>
          <input
            type="text"
            placeholder="pl.: www.instagram.com/12xosztaly"
            className="input input-bordered"
            onChange={handleInstagramChange}
            value={instagram}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Rövid bemutatkozás (főoldal alja)
            </span>
          </label>
          <textarea
            placeholder="pl.: Sziasztok, mi vagyunk a 12.X osztály, és..."
            className="textarea"
            onChange={handleShortIntroductionChange}
            value={shortIntroduction}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Hosszú leírás (saját oldal)</span>
          </label>
          <textarea
            placeholder="pl.: Sziasztok, mi vagyunk a 12.X osztály, és..."
            className="textarea"
            onChange={handleDescriptionChange}
            value={description}
          />
        </div>
      </div>

      <button className="btn btn-secondary w-full mt-4" onClick={handleSave}>
        Mentés
        <span id="edit-reward"></span>
      </button>
    </>
  );
};

export default EditClass;
