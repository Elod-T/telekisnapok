import { NextPage } from "next";
import { useState } from "react";
import ClassData from "@interfaces/classData";
import { fileToBase64 } from "@utils/base64";

interface ClassFormProps {
  classNumber: number;
  onSave: (_class: ClassData) => void;
}

const ClassForm: NextPage<ClassFormProps> = ({ classNumber, onSave }) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState<string>("12.");
  const [adjective, setAdjective] = useState<string>();
  const [candidateName, setCandidateName] = useState<string>();
  const [candidateImage, setCandidateImage] = useState<string>();
  const [managers, setManagers] = useState<string[]>([]);
  const [shortIntroductionEdited, setShortIntroductionEdited] = useState(false);
  const [shortIntroduction, setShortIntroduction] = useState<string>();
  const [descriptionEdited, setDescriptionEdited] = useState(false);
  const [description, setDescription] = useState<string>();
  const [instagram, setInstagram] = useState<string>(
    "https://www.instagram.com/"
  );

  const placeHolderText = `Sziasztok, mi vagyunk a ${name} osztály, a(z) ${adjective}! Elragadó jelöltünk pedig ${candidateName}! Szavazz ránk és hidd el, nem fogod megbánni!`;

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);

    if (
      !shortIntroductionEdited &&
      adjective != null &&
      candidateName != null
    ) {
      setShortIntroduction(placeHolderText);
    }

    if (!descriptionEdited && adjective != null && candidateName != null) {
      setDescription(placeHolderText);
    }
  }
  function handleCandidateNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCandidateName(e.target.value);

    if (
      !shortIntroductionEdited &&
      adjective != null &&
      candidateName != null
    ) {
      setShortIntroduction(placeHolderText);
    }

    if (!descriptionEdited && adjective != null && candidateName != null) {
      setDescription(placeHolderText);
    }
  }

  function handleAdjectiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdjective(e.target.value);

    if (
      !shortIntroductionEdited &&
      adjective != null &&
      candidateName != null
    ) {
      setShortIntroduction(placeHolderText);
    }

    if (!descriptionEdited && adjective != null && candidateName != null) {
      setDescription(placeHolderText);
    }
  }

  function handleManagersChange(e: React.ChangeEvent<HTMLInputElement>) {
    setManagers(e.target.value.split(","));
  }

  function handleShortIntroductionChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setShortIntroduction(e.target.value);
    setShortIntroductionEdited(true);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    setDescriptionEdited(true);
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
    if (
      !name ||
      !adjective ||
      !candidateName ||
      !candidateImage ||
      !managers ||
      !shortIntroduction ||
      !description ||
      !instagram
    ) {
      alert("Néhány kötelező mező üres!");
      return;
    }

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

    setOpen(false);
  }

  return (
    <div className="collapse collapse-arrow bg-base-300 rounded-lg">
      <input
        checked={open}
        onClick={() => setOpen(!open)}
        onChange={() => {}}
        type="checkbox"
      />

      <div className="collapse-title">
        <h5 className="text-lg font-bold">Osztály {classNumber + 1}</h5>
      </div>

      <div className="collapse-content">
        <div className="grid md:grid-cols-2 gap-x-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Osztály <span className="text-error">*</span>
              </span>
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
              <span className="label-text">
                Jelölt neve <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="pl.: John Doe"
              className="input input-bordered"
              onChange={handleCandidateNameChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Jelölt fényképe <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered"
              onChange={handleCandidateImageChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Jelző (T/3) <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="pl.: szakácsok"
              className="input input-bordered"
              onChange={handleAdjectiveChange}
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
                <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="pl.: gipsz.jakab@sztbg.hu, jozsef.attila@sztbg.hu"
              className="input input-bordered"
              onChange={handleManagersChange}
            />
          </div>

          <div className="form-control ">
            <label className="label">
              <span className="label-text">Instagram</span>
            </label>
            <input
              type="text"
              placeholder="pl.: www.instagram.com/12xosztaly"
              value={instagram}
              className="input input-bordered"
              onChange={handleInstagramChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Rövid bemutatkozás (főoldal alja){" "}
                <span
                  className="tooltip tooltip-info link"
                  data-tip="Nem muszáj most kitölteni, később az admin felületen lehet módosítani. Illetve az adott osztály 'managerei' is módosíthatják."
                >
                  ?
                </span>
              </span>
            </label>
            <textarea
              placeholder="pl.: Sziasztok, mi vagyunk a 12.X osztály, és..."
              value={shortIntroduction}
              className="textarea"
              onChange={handleShortIntroductionChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Hosszú leírás (saját oldal){" "}
                <span
                  className="tooltip tooltip-info link"
                  data-tip="Nem muszáj most kitölteni, később az admin felületen lehet módosítani. Illetve az adott osztály 'managerei' is módosíthatják."
                >
                  ?
                </span>
              </span>
            </label>
            <textarea
              placeholder="pl.: Sziasztok, mi vagyunk a 12.X osztály, és..."
              value={description}
              className="textarea"
              onChange={handleDescriptionChange}
            />
          </div>
        </div>

        <button className="btn btn-secondary w-full mt-4" onClick={handleSave}>
          Mentés
        </button>
      </div>
    </div>
  );
};

export default ClassForm;
