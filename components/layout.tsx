import { NextPage } from "next";
import Footer from "./footer";
import Navbar from "./navbar";
import Seo, { SeoProps } from "./seo";
import Blob from "./blob";
import { Suspense } from "react";
import { useRouter } from "next/router";
import Loading from "./loading";

interface LayoutProps extends SeoProps {
  children: React.ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children, title, description }) => {
  const router = useRouter();
  const index = router.pathname === "/";

  return (
    <Suspense fallback={<Loading />}>
      {index && <Blob />}
      <Seo title={title} description={description} />
      <Navbar />
      {children}
      <Footer />
    </Suspense>
  );
};

export default Layout;
