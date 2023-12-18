// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import Avatar, { Piece } from "avataaars";
import { allPiecesOptions, allAvatarStyles } from "./AvatarOptions";

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
  for (let i = 0; i < 200; i++) {
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
  return (
    <>
      <h1>Avatar</h1>
      <div id="avatars">{avatars}</div>

      {/* <div>
        <h2>Avatar Pieces</h2>
        <div>
          <Piece pieceType="mouth" pieceSize="100" mouthType="Eating" />
          <Piece pieceType="eyes" pieceSize="100" eyeType="Dizzy" />
          <Piece
            pieceType="eyebrows"
            pieceSize="100"
            eyebrowType="RaisedExcited"
          />
          <Piece
            pieceType="accessories"
            pieceSize="100"
            accessoriesType="Round"
          />
          <Piece
            pieceType="top"
            pieceSize="100"
            topType="LongHairFro"
            hairColor="Red"
          />
          <Piece
            pieceType="facialHair"
            pieceSize="100"
            facialHairType="BeardMajestic"
          />
          <Piece
            pieceType="clothe"
            pieceSize="100"
            clotheType="Hoodie"
            clotheColor="Red"
          />
          <Piece pieceType="graphics" pieceSize="100" graphicType="Skull" />
          <Piece pieceType="skin" pieceSize="100" skinColor="Brown" />
        </div>
      </div> */}
    </>
  );
}

export default App;
