"use client";
import Avatar, { Piece } from "avataaars";
import { allPiecesOptions } from "../AvatarOptions";
import { useState, PointerEvent, useLayoutEffect } from "react";
import { Generate } from "@/fal/Generate";

function randomElement(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function randomTypeOption(type: string) {
  const _type = allPiecesOptions.find((options) => options.type === type);
  return randomElement(_type?.options || []);
}

export default function Avatars() {
  const avatars = [];
  const avatarDimension = 100;

  useLayoutEffect(() => {
    Generate();
  }, []);

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

  for (let i = 0; i < 50; i++) {
    avatars.push(
      <RandomAvatar
        key={i}
        onClick={onAvatarClick}
        dimension={avatarDimension}
      />
    );
  }

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

  const [randomSeed, setRandomSeed] = useState(0);

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
          onPointerDown={() => setRandomSeed(Math.random())}
        >
          🔀
        </button>
      </h1>
      <RandomAvatar
        id="source-avatar"
        onClick={onAvatarClick}
        dimension={400}
      />
      <h1 style={{ margin: "20px 0px 0px 0px" }}>
        Avatar Grid{" "}
        <button
          style={{
            border: "none",
            background: "none",
            fontSize: "1em",
            cursor: "pointer",
          }}
          onPointerDown={() => setRandomSeed(Math.random())}
        >
          🔀
        </button>
      </h1>
      <p>Tap an Avatar to copy SVG to clipboard</p>
      <div id="avatars">{avatars}</div>

      <h1>Avatar Pieces</h1>
      <div>{pieces}</div>
      <p>Random seed: {randomSeed}</p>
    </>
  );
}

type RandomAvatarProps = {
  onClick: (event: PointerEvent<HTMLDivElement>) => void;
  dimension: number;
  id?: string;
};

function RandomAvatar({ onClick, dimension, id }: RandomAvatarProps) {
  return (
    <span id={id} onPointerDownCapture={onClick} style={{ cursor: "pointer" }}>
      <Avatar
        style={{
          width: dimension,
          height: dimension,
          margin: 5,
        }}
        // avatarStyle={randomElement(allAvatarStyles)}
        avatarStyle="Transparent"
        topType={randomTypeOption("topType")}
        accessoriesType={randomTypeOption("accessoriesType")}
        hairColor={randomTypeOption("hairColor")}
        facialHairType={randomTypeOption("facialHairType")}
        clotheType={randomTypeOption("clotheType")}
        clotheColor={randomTypeOption("clotheColor")}
        eyeType={randomTypeOption("eyeType")}
        eyebrowType={randomTypeOption("eyebrowType")}
        mouthType={randomTypeOption("mouthType")}
        skinColor={randomTypeOption("skinColor")}
        pieceSize={randomTypeOption("pieceSize")}
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
