/* eslint-disable @next/next/no-img-element */
import Layout from "@components/layout";
import { NextPage } from "next";
import Link from "next/link";

const ErrorPage: NextPage = () => {
  return (
    <Layout title="Itt valami hiba van" description="Error page">
      <div className="flex flex-col items-center justify-center min-h-screen py-2 mt-20 text-center">
        <Link className="mt-8 text-xl font-medium link" href="/">
          Vissza a főoldalra
        </Link>
        <img src="https://http.cat/500" alt="500 error cat meme" />
        <p className="mt-3 text-xl font-medium">
          A keresett oldal nem található
        </p>
        <p className="mt-3 text-xl font-medium">Vagy nem létezik</p>
        <Link className="mt-8 text-xl font-medium link" href="/">
          Vissza a főoldalra
        </Link>
      </div>
    </Layout>
  );
};

export default ErrorPage;
