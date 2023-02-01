import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import Layout from "@components/layout";
import isAdmin from "@utils/isAdmin";
import Loading from "@components/loading";
import ClassForm from "@components/classForm";
import Datepicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { useReward } from "react-rewards";
import ClassData from "@interfaces/classData";

const CreateElection: NextPage = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState<string>(
    `Telekis Napok ${new Date().getFullYear()}`
  );
  const [timeInterval, setTimeInterval] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [active, setActive] = useState<boolean>(true);
  const [classes, setClasses] = useState<ClassData[]>([]);

  const { reward, isAnimating } = useReward("create-reward", "confetti");

  if (session && !isAdmin(session?.user?.email)) {
    return <h1 className="text-center text-4xl mt-40">Nincs jogosultságod</h1>;
  }

  if (status === "unauthenticated") {
    signIn("azure-ad");
    return null;
  }

  if (status === "loading") {
    return <Loading />;
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleDateChange(newValue: DateValueType) {
    if (!newValue) return;
    setTimeInterval(newValue);
  }

  function handleActiveChange() {
    setActive(!active);
  }

  function addClass() {
    setClasses([
      ...classes,
      {
        name: "",
        candidateName: "",
        candidateImage: "",
        managers: [],
        adjective: "",
        shortIntroduction: "",
        description: "",
        instagram: "",
      },
    ]);
  }

  function saveClass(data: ClassData, index: number) {
    const newClasses = [...classes];
    newClasses[index] = data;
    setClasses(newClasses);
  }

  function deleteLastClass() {
    setClasses(classes.slice(0, -1));
  }

  async function handleSubmit() {
    if (!name || !timeInterval || classes.length == 0) return;
    console.log({
      name,
      timeInterval,
      active,
      classes,
    });

    axios
      .post("/api/admin/createElection", {
        name,
        timeInterval,
        active,
        classes,
      })
      .then(() => {
        reward();

        setTimeout(() => {
          window.location.href = `/${new Date(
            timeInterval.startDate!
          ).getFullYear()}`;
        }, 1000);
      })
      .catch((err) => {
        alert(`Hiba történt: ${err}`);
      });
  }

  return (
    <Layout
      title={`Telekis Napok ${new Date().getFullYear()} | Admin Felület`}
      description="Telekis Napok Szavazás Admin Felület"
    >
      <div className="mt-40 mb-32 md:mb-[500px] bg-base-200 mx-auto md:w-2/3 lg:w-1/2 p-4 md:p-10 rounded-lg flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold text-cener mb-10">
          Új szavazás készítése
        </h1>

        <div className="text-sm">
          A kötelező mezők csillaggal vannak jelölve:{" "}
          <span className="text-error">*</span>
        </div>

        <div className="text-sm">
          Néhány mezőhöz segíséget ad az aláhúzott kérdőjel, ha rávisszük a
          kurzort:{" "}
          <span
            className="tooltip tooltip-info link"
            data-tip="És egy ilyen szöveg jelenik meg"
          >
            ?
          </span>
        </div>

        <h2 className="text-2xl font-medium mt-4">Alap adatok</h2>
        <div className="grid md:grid-cols-2">
          <div className="form-control w-full max-w-sm">
            <label className="label">
              <span className="label-text">
                Szavazás neve <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="pl.: TN 2023"
              className="input input-bordered w-full max-w-xs"
              onChange={handleNameChange}
              value={name}
            />
          </div>

          <div className="form-control w-full max-w-sm">
            <label className="label">
              <span className="label-text">
                Szavazás időtartama <span className="text-error">*</span>
              </span>
            </label>

            <Datepicker
              i18n="hu"
              startWeekOn="monday"
              useRange={false}
              configs={{
                shortcuts: {
                  today: "Ma",
                  yesterday: "Tegnap",
                  past: (period) => `Utolsó ${period} nap`,
                  currentMonth: "Jelenlegi hónap",
                  pastMonth: "Múlt hónap",
                },
                footer: {
                  cancel: "Mégse",
                  apply: "Kész",
                },
              }}
              primaryColor="amber"
              value={timeInterval}
              onChange={handleDateChange}
              showShortcuts={true}
              showFooter={true}
            />
          </div>

          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">Azonnal aktív</span>
              <input
                type="checkbox"
                className="checkbox"
                onChange={handleActiveChange}
                defaultChecked={active}
              />
              <span
                className="tooltip tooltip-info link"
                data-tip="Ez lesz az aktív szavazás azonnal, amint el lett tárolva az adatbázisban. Azaz csak ezen a szavazáson lehet szavazni."
              >
                ?
              </span>
            </label>
          </div>
        </div>
        <h2 className="text-2xl mt-10 font-medium">Osztályok hozzáadása</h2>

        <div className="w-full grid md:grid-cols-2 gap-4">
          <button className="btn btn-secondary" onClick={addClass}>
            Osztály hozzáadása
          </button>
          <label htmlFor="delete-confirmation" className="btn btn-error">
            Utolsó osztály törlése
          </label>
        </div>

        {classes.map((_, index) => (
          <ClassForm
            key={index}
            classNumber={index}
            onSave={(classData) => saveClass(classData, index)}
          />
        ))}

        <label htmlFor="create-confirmation" className="btn btn-primary mt-10">
          Véglegesítés
        </label>
      </div>

      <div>
        <input
          type="checkbox"
          id="delete-confirmation"
          className="modal-toggle"
        />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Biztosan törli a {classes[classes.length - 1]?.name} osztályt?
            </h3>
            <p className="py-4">
              Ezt a lépést nem lehet visszavonni. Ha törli, akkor az osztály
              minden adata törlődik.
            </p>
            <div className="modal-action">
              <label htmlFor="delete-confirmation" className="btn btn-success">
                Nem, megtartom
              </label>
              <button className="btn btn-error" onClick={deleteLastClass}>
                Igen, törlöm
              </button>
            </div>
          </div>
        </div>

        <input
          type="checkbox"
          id="create-confirmation"
          className="modal-toggle"
        />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Biztosan létrehozza a szavazást?
            </h3>
            <p className="py-4">
              Ez a lépés után a szavazás azonnal elérhető lesz, hogy a
              &apos;managerek&apos; módosíthassák a tartalmat, stb.{" "}
              <span className="underline">
                Ha az aktív be van jelölve, akkor azonnal elérhető lesz a
                szavazás.
              </span>
            </p>
            <div className="modal-action">
              <label htmlFor="create-confirmation" className="btn btn-success">
                Nem, mégsem
              </label>
              <button
                className="btn btn-error"
                onClick={handleSubmit}
                disabled={isAnimating}
              >
                <span id="create-reward" className="relative z-50"></span>
                Igen, véglegesítem
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateElection;
