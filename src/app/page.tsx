import Image from "next/image";

import dynamic from "next/dynamic";

const Avatars = dynamic(() => import("../components/Avatars"), { ssr: false });

export default function Home() {
  return (
    <div className="root">
      <Avatars />
    </div>
  );
}
