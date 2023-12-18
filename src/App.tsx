// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import Avatar, { Piece } from "avataaars";
import { allPiecesOptions } from "./AvatarOptions";

function randomElement(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function randomTypeOption(type: string) {
  const _type = allPiecesOptions.find((options) => options.type === type);
  return randomElement(_type?.options || []);
}

function App() {
  const avatars = [];
  const avatarDimension = 100;
  for (let i = 0; i < 100; i++) {
    avatars.push(
      <span>
        <Avatar
          key={i}
          style={{
            width: avatarDimension,
            height: avatarDimension,
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
      </span>
    );
  }

  const pieces = allPiecesOptions.map((type, pieceIndex) => {
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
    console.log(options);
    return (
      <div key={pieceIndex}>
        <h2>{type.type}</h2>
        <div>{options}</div>
      </div>
    );
  });

  return (
    <>
      <h1>Avatar</h1>
      <div id="avatars">{avatars}</div>

      <div>
        <h2>Avatar Pieces</h2>
        <div>{pieces}</div>
      </div>
    </>
  );
}

export default App;
