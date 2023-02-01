import { NextPage } from "next";
import { useEffect, useRef } from "react";

const Blob: NextPage = () => {
  const mousePosition = useRef({ x: -100, y: -100 });
  const blobPosition = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef(0);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const move = setInterval(() => {
      moveBlob();
    }, 20);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(move);
    };
  });

  function handleMouseMove(event: MouseEvent) {
    mousePosition.current = { x: event.clientX - 24, y: event.clientY - 24 };
  }

  function handleScroll() {
    scrollPosition.current = window.scrollY;
  }

  function moveBlob() {
    const blob = document.getElementById("blob");

    if (!blob) return;

    const distanceX = mousePosition.current.x - blobPosition.current.x;
    const distanceY = mousePosition.current.y - blobPosition.current.y;

    blobPosition.current = {
      x: blobPosition.current.x + distanceX / 6,
      y: blobPosition.current.y + distanceY / 6,
    };

    blob.style.left = `${blobPosition.current.x}px`;
    blob.style.top = `${blobPosition.current.y + scrollPosition.current}px`;
  }

  return <span id="blob" className="blob hidden md:block"></span>;
};

export default Blob;
