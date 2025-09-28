"use client";
import { useSession } from "next-auth/react";
import Image, { type ImageProps } from "next/image";
import { useRouter } from "next/navigation";


type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If you want to honor a callback in the URL, uncomment next line:
  // const callbackUrl = params.get("callbackUrl") || "/Dashboard";
  const callbackUrl = "/login";
   router.replace(callbackUrl);
  return <div>Hello,world</div>;
}
