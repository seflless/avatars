import * as fal from "@fal-ai/serverless-client";

export async function Generate() {
  fal.config({
    requestMiddleware: fal.withProxy({
      targetUrl: "/api/fal/proxy",
    }),
  });

  const { send, close } = fal.realtime.connect("110602490-lcm-sd15-i2i", {
    connectionKey: "fal-realtime-example",
    clientOnly: false,
    // throttleInterval: throttleTime,
    onError: (error) => {
      console.error(error);
      // force re-connect
      //
    },
    onResult: (result) => {
      if (result.images && result.images[0]) {
        console.log("hello!");
        console.log(result.images[0]);
      }
    },
  });

  const response = await fetch("/childs-drawing-of-a-house.png");
  const blob = await response.blob();
  const imageDataUri = await blobToDataUri(blob);
  console.log(imageDataUri);

  const prompt = `Children's drawing of a house magically made real`;

  send({
    prompt,
    image_url: imageDataUri,
    sync_mode: true,
    strength: 0.65,
    // seed: Math.abs(Math.random() * 10000), // TODO make this configurable in the UI
    seed: 0,
    request_id: "first",
    enable_safety_checks: false,
  });
}

export async function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert Blob to base64 data URI"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
