"use client";
import { Generate } from "@/fal/Generate";
import { useEffect, useRef, useState } from "react";

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const startedAlreadyRef = useRef(false);
  const [shouldStart, setShouldStart] = useState(false);

  return (
    <>
      <video
        // style={{ display: shouldStart ? "inherit" : "none" }}

        autoPlay
        playsInline
        ref={videoRef}
      ></video>

      <img style={{ opacity: 0.8, position: "absolute" }} ref={imageRef} />
      <button
        style={{ display: shouldStart ? "none" : "inherit", cursor: "pointer" }}
        onClick={() => {
          setShouldStart(true);
          start(videoRef.current!, imageRef.current!);
        }}
      >
        Start
      </button>
    </>
  );
}

async function getBackCameraStream(): Promise<MediaStream | null> {
  try {
    // Constraints for the back camera
    const constraints: MediaStreamConstraints = {
      video: {
        // facingMode: { exact: "environment" },
        facingMode: "environment",
      },
    };

    // Request access to the media devices
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error("Error accessing back camera:", error);
    return null;
  }
}

async function start(video: HTMLVideoElement, image: HTMLImageElement) {
  // Usage example
  getBackCameraStream()
    .then((stream) => {
      if (stream) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();

          // Create a canvas element
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          video.style.width = `${canvas.width}px`;
          video.style.height = `${canvas.height}px`;

          //   image.style.borderRadius = `${canvas.width / 2}px`;
          //   image.style.width = `${minDimension}px`;
          //   image.style.height = `${minDimension}px`;

          // Get the context of the canvas
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Unable to get canvas context");
          }

          setInterval(async () => {
            // Draw the current frame of the video onto the canvas

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas to a Data URI
            const cameraFeedDataUri = canvas.toDataURL();

            const dataUri = await Generate(
              cameraFeedDataUri,
              "A picture of a monster",
              0.65,
              //   0.1,
              //   0.4,
              (imageDataUri) => {
                // console.log("Generated dataUri");
                // console.log(imageDataUri);

                // if (imageRef.current) {
                image.src = imageDataUri;
                // }
              }
            );
          }, 500);
        };
      }
    })
    .catch((error) => {
      console.error("Error getting back camera stream:", error);
    });
}
