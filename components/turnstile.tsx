import { NextPage } from "next";
import Turnstile from "react-turnstile";

interface TurnstileComponentProps {
  onVerify: (token: string) => void;
  onFail: () => void;
}

const TurnstileComponent: NextPage<TurnstileComponentProps> = ({
  onVerify,
  onFail,
}) => {
  return (
    <div className="md:w-1/3 mx-auto mt-10 bg-base-200 py-20 md:py-10 rounded-lg grid place-content-center">
      <h1 className="text-4xl font-bold mb-4">Böngésző ellenőrzése...</h1>
      <Turnstile
        sitekey={
          process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string
        }
        onVerify={(token) => {
          onVerify(token);
        }}
        onError={onFail}
        onTimeout={onFail}
        onExpire={onFail}
      />
    </div>
  );
};

export default TurnstileComponent;
