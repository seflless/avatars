"use client";
import Avatar, { Piece } from "avataaars";
import { allPiecesOptions } from "../AvatarOptions";
import {
  useState,
  PointerEvent,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import { Generate, svgToDataUri } from "@/fal/Generate";

function randomElement(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function randomTypeOption(type: string) {
  const _type = allPiecesOptions.find((options) => options.type === type);
  return randomElement(_type?.options || []);
}

type AvatarSettings = {
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
};

function generateRandomAvatar(): AvatarSettings {
  return {
    topType: randomTypeOption("topType"),
    accessoriesType: randomTypeOption("accessoriesType"),
    hairColor: randomTypeOption("hairColor"),
    facialHairType: randomTypeOption("facialHairType"),
    clotheType: randomTypeOption("clotheType"),
    clotheColor: randomTypeOption("clotheColor"),
    eyeType: randomTypeOption("eyeType"),
    eyebrowType: randomTypeOption("eyebrowType"),
    mouthType: randomTypeOption("mouthType"),
    skinColor: randomTypeOption("skinColor"),
  };
}

export default function Avatars() {
  const avatarDimension = 150;

  const imageRef = useRef<HTMLImageElement>(null);

  const [avatarSettings, setAvatarSettings] = useState<AvatarSettings>(
    generateRandomAvatar()
  );

  const [prompt, setPrompt] = useState<string>(
    `A award winning photograph of a baby`
  );

  const [strength, setStrength] = useState(0.65);

  useLayoutEffect(() => {
    async function run() {
      const avatarSVG = document.getElementById("source-avatar")
        ?.childNodes[0] as unknown as SVGAElement;
      if (!avatarSVG) {
        throw new Error("No avatar SVG");
      }
      const avatarDataUri = await svgToDataUri(avatarSVG);
      // console.log(avatarDataUri);

      const dataUri = await Generate(
        avatarDataUri,
        prompt,
        strength,
        (imageDataUri) => {
          console.log("Generated dataUri");
          console.log(imageDataUri);

          // if (imageRef.current) {
          imageRef.current!.src = imageDataUri;
          // }
        }
      );
    }
    void run();
  }, [avatarSettings, prompt, strength]);

  const onAvatarClick = (event: PointerEvent<HTMLDivElement>): void => {
    console.log(event.currentTarget.childNodes[0]);

    const svgElement = event.currentTarget.childNodes[0] as SVGAElement;
    let copyText = svgElement.outerHTML;

    const newDims = 650;
    copyText = copyText
      .replace(`width="264px"`, `width="${newDims}px"`)
      .replace(`height="280px"`, `height="${newDims}px"`);

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);

    const clipboardIcon = event.currentTarget.querySelector(
      ".clipboard-icon"
    ) as HTMLSpanElement;
    // Function to trigger the glow effect
    function triggerGlow() {
      clipboardIcon.classList.add("flash");

      // Remove the class after animation ends (2 seconds here)
      setTimeout(() => {
        clipboardIcon.classList.remove("flash");
      }, 1000);
    }

    // Example: Trigger the glow effect on page load
    triggerGlow();
  };

  const avatars = useMemo(() => {
    const _avatars = [];
    for (let i = 0; i < 50; i++) {
      const settings: AvatarSettings = generateRandomAvatar();
      _avatars.push(
        <RandomAvatar
          key={i}
          avatarSettings={settings}
          onClick={(event) => {
            onAvatarClick(event);
            setAvatarSettings(settings);
          }}
          dimension={avatarDimension}
        />
      );
    }
    return _avatars;
  }, []);

  const pieces = allPiecesOptions.map((type, typeIndex) => {
    const options = type.options.map((option, optionIndex) => {
      return (
        <Piece
          key={optionIndex}
          pieceType={type.pieceType}
          pieceSize="100"
          {...{
            [type.pieceType + "Type"]: option,
            [type.pieceType + "Color"]: "Red",
          }}
          hairColor="Red"
          avatarStyle="Transparent"
        />
        // <Piece
        //   pieceType="top"
        //   pieceSize="100"
        //   topType="LongHairFro"
        //   hairColor="Red"
        // />
      );
    });

    return (
      <div key={typeIndex}>
        <h1>{type.type}</h1>
        <div>{options}</div>
      </div>
    );
  });

  return (
    <>
      <h1 style={{ margin: "20px 0px 0px 0px" }}>
        Avatar{" "}
        <button
          style={{
            border: "none",
            background: "none",
            fontSize: "1em",
            cursor: "pointer",
          }}
          onPointerDown={() => setAvatarSettings(generateRandomAvatar())}
        >
          🔀
        </button>
      </h1>

      <div
        className="flex flex-row "
        style={{ backgroundColor: "rgb(224,224,224)" }}
      >
        <RandomAvatar
          avatarSettings={avatarSettings}
          id="source-avatar"
          onClick={onAvatarClick}
          dimension={400}
        />
        <img ref={imageRef} style={{ width: 400, height: 400 }} src="" alt="" />
      </div>
      <h2 className="text-2xl py-2">Image&lsquo;s Influence</h2>
      <input
        type="range"
        min={0.1}
        max={1.0}
        step={0.01}
        value={strength}
        onChange={(e) => {
          const newStrenght = parseFloat(e.target.value);
          console.log(newStrenght);
          setStrength(newStrenght);
        }}
      />

      <p>{Math.floor(strength * 100)}%</p>
      <textarea
        className="rounded-2xl m-4 p-4"
        style={{ width: 800, height: 100 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <h1 style={{ margin: "20px 0px 0px 0px" }}>Inspiration</h1>
      <p>Tap an Avatar to transmogrify it</p>
      <div id="avatars">{avatars}</div>

      <h1>Avatar Pieces</h1>
      <div>{pieces}</div>
    </>
  );
}

type RandomAvatarProps = {
  onClick: (event: PointerEvent<HTMLDivElement>) => void;
  dimension: number;
  id?: string;
  avatarSettings: AvatarSettings;
};

function RandomAvatar({
  onClick,
  dimension,
  id,
  avatarSettings,
}: RandomAvatarProps) {
  return (
    <span id={id} onPointerDownCapture={onClick} style={{ cursor: "pointer" }}>
      <Avatar
        style={{
          width: dimension,
          height: dimension,
        }}
        // avatarStyle={randomElement(allAvatarStyles)}
        avatarStyle="Transparent"
        // topType={randomTypeOption("topType")}
        // accessoriesType={randomTypeOption("accessoriesType")}
        // hairColor={randomTypeOption("hairColor")}
        // facialHairType={randomTypeOption("facialHairType")}
        // clotheType={randomTypeOption("clotheType")}
        // clotheColor={randomTypeOption("clotheColor")}
        // eyeType={randomTypeOption("eyeType")}
        // eyebrowType={randomTypeOption("eyebrowType")}
        // mouthType={randomTypeOption("mouthType")}
        // skinColor={randomTypeOption("skinColor")}
        {...avatarSettings}
        // pieceSize={randomTypeOption("pieceSize")}
        // viewBox="0 0 800 800"
      />
      <span
        style={{
          position: "relative",
          left: -32,
          top: -88,
        }}
        className="clipboard-icon"
      >
        ✅
      </span>
    </span>
  );
}
