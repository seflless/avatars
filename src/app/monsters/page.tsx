import Image from "next/image";

import dynamic from "next/dynamic";

const CameraFeed = dynamic(() => import("../../components/CameraFeed"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="root">
      <CameraFeed />
    </div>
  );
}
