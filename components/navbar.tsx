/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import isAdmin from "@utils/isAdmin";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL!);

const Navbar: NextPage = () => {
  const { data: session } = useSession();
  const [scroll, setScroll] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    getVotes();

    axios.get("/api/getCurrentElection").then((res) => {
      socket.on("update", (electionId) => {
        if (electionId == res.data.id) {
          getVotes();
        }
      });
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getVotes() {
    axios.get("/api/getCurrentElection").then((res) => {
      if (res.data.id == null) return;
      axios.get(`/api/getVoteCount?electionId=${res.data.id}`).then((resp) => {
        setVoteCount(resp.data.votes);
      });
    });
  }

  function handleScroll() {
    setScroll(window.scrollY);
  }

  return (
    <header
      className="fixed top-0 navbar md:w-3/4 left-1/2 -translate-x-1/2 z-40 md:rounded-lg md:mt-1 bg-base-200 flex flex-row justify-between"
      style={{ backgroundColor: `rgba(17, 16, 18, ${0.6 + scroll / 2000})` }}
    >
      <Link
        href="/"
        className="logo btn btn-ghost normal-case text-xl"
        data-short-version={`TN - 2K${new Date().getFullYear() - 2000}`}
        aria-label="Főoldal"
      >
        <span>Telekis Napok {new Date().getFullYear()}</span>
      </Link>

      <div className="absolute left-[40%] md:left-1/2 md:-translate-x-1/2 flex-row gap-1">
        <div className="font-medium logo" data-short-version="Szavazatok:">
          <span>Online leadott szavazatok száma: </span>
        </div>
        <div className="text-primary font-bold text-xl">{voteCount}</div>
      </div>

      <div className="dropdown dropdown-end">
        {session ? (
          <>
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-white">
                <img
                  src={session.user?.image ? session.user.image : "/user.webp"}
                  alt="profile picture"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {isAdmin(session.user?.email) && (
                <li>
                  <Link href="/admin/dashboard">Admin</Link>
                </li>
              )}
              <li>
                <Link href="/dashboard">Eredmények</Link>
              </li>
              <li>
                <button onClick={() => signOut()}>Kijelentkezés</button>
              </li>
            </ul>
          </>
        ) : (
          <button
            className="btn"
            onClick={() => {
              signIn("azure-ad");
            }}
          >
            Bejelentkezés
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
