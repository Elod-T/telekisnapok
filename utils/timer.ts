export default function updateTimer(launch: Date) {
  const now = new Date().getTime();
  const distance = launch.getTime() - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const d = document.querySelectorAll(
    "[data-time-id=d]"
  ) as NodeListOf<HTMLSpanElement>;
  const h = document.querySelectorAll(
    "[data-time-id=h]"
  ) as NodeListOf<HTMLSpanElement>;
  const m = document.querySelectorAll(
    "[data-time-id=m]"
  ) as NodeListOf<HTMLSpanElement>;
  const s = document.querySelectorAll(
    "[data-time-id=s]"
  ) as NodeListOf<HTMLSpanElement>;

  if (!(d && h && m && s)) return;

  d.forEach((item) =>
    item.style.setProperty("--value", Math.abs(days).toString())
  );
  h.forEach((item) =>
    item.style.setProperty("--value", Math.abs(hours).toString())
  );
  m.forEach((item) =>
    item.style.setProperty("--value", Math.abs(minutes).toString())
  );
  s.forEach((item) =>
    item.style.setProperty("--value", Math.abs(seconds).toString())
  );
}
