import * as fal from "@fal-ai/serverless-client";

import { debounce } from "throttle-debounce";

fal.config({
  requestMiddleware: fal.withProxy({
    targetUrl: "/api/fal/proxy",
  }),
});

type Requests = {
  [key: string]: (dataUri: string) => void;
};
const requests: Requests = {};

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
      // console.log(result.images[0]);
      console.log("OUTPUT");
      console.log(result.images[0].url);
      requests[result.request_id](result.images[0].url);
      delete requests[result.request_id];
    }
  },
});

let requestId = 0;

export const Generate = debounce(
  250,
  async (
    imageDataUri: string,
    prompt: string,
    strength: number,
    cb: (imageDataUri: string) => void
  ) => {
    // let prompt = `A award winning photograph of a baby`;
    // if (imageDataUri === undefined) {
    //   const response = await fetch("/childs-drawing-of-a-house.png");
    //   const blob = await response.blob();
    //   imageDataUri = await blobToDataUri(blob);
    //   prompt = `Children's drawing of a house magically made real`;
    // }

    console.log("INPUT");
    console.log(imageDataUri);

    // console.log(imageDataUri);

    // const prompt = `A realistic baby avatar`;

    // return new Promise<string>((resolve, reject) => {
    const requestIdString = "requestId-" + requestId.toString();
    requestId++;

    requests[requestIdString] = cb;
    send({
      prompt,
      image_url: imageDataUri,
      sync_mode: true,
      // strength: 0.65,
      strength,
      // seed: Math.abs(Math.random() * 10000), // TODO make this configurable in the UI
      seed: 0,
      request_id: requestIdString,
      enable_safety_checks: false,
    });
    // });
  }
);

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

function copyStylesInline(destinationNode: any, sourceNode: any) {
  var containerElements = ["svg", "g"];
  for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
    var child = destinationNode.childNodes[cd];
    if (containerElements.indexOf(child.tagName) != -1) {
      copyStylesInline(child, sourceNode.childNodes[cd]);
      continue;
    }
    var style =
      sourceNode.childNodes[cd].currentStyle ||
      window.getComputedStyle(sourceNode.childNodes[cd]);
    if (style == "undefined" || style == null) continue;
    for (var st = 0; st < style.length; st++) {
      child.style.setProperty(style[st], style.getPropertyValue(style[st]));
    }
  }
}

export async function svgToDataUri(svg: SVGAElement): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    var copy = svg.cloneNode(true) as SVGAElement;
    copyStylesInline(copy, svg);

    copy.setAttribute("width", "800");
    copy.setAttribute("height", "800");

    var canvas = document.createElement("canvas");
    var bbox = svg.getBBox();

    bbox.width = 800;
    bbox.height = 800;

    console.log(bbox);
    canvas.width = bbox.width;
    canvas.height = bbox.height;
    var ctx = canvas.getContext("2d");

    if (ctx === null) {
      reject(new Error("Failed to get canvas context"));
      return;
    }
    ctx.fillStyle = "rgb(214, 219, 220)";
    ctx.fillRect(0, 0, bbox.width, bbox.height);
    // ctx.clearRect(0, 0, bbox.width, bbox.height);

    var data = new XMLSerializer().serializeToString(copy);

    var img = new Image();
    var svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(svgBlob);
    img.onload = function () {
      if (ctx === null) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 18, 36);
      URL.revokeObjectURL(url);

      var imgURI = canvas.toDataURL("image/png");
      // .replace("image/png", "image/octet-stream");
      // triggerDownload(imgURI, fileName);

      // document.removeChild(canvas);

      resolve(imgURI);
    };
    img.src = url;
  });
}
