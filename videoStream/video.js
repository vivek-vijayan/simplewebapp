var video = document.getElementById("video");
var model;

var ctx;
ctx = document.getElementById("canvas").getContext("2d");
const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 400 },
      audio: false,
    })
    .then((stream) => {
      document.getElementById("video").srcObject = stream;
    });
};

const faceDetection = async () => {
  const prediction = await model.estimateFaces(
    document.getElementById("video"),
    false
  );
  ctx.drawImage(video, 0, 0, 600, 400);
  console.log(prediction);
  document.getElementById("faces").innerHTML =
    "Total Faces : " + prediction.length;

    prediction.forEach((pred) => {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "red";
        ctx.rect(
          pred.topLeft[0],
          pred.topLeft[1],
          pred.bottomRight[0] - pred.topLeft[0],
          pred.bottomRight[1] - pred.topLeft[1],
          )
        ctx.stroke();
    });
};

async function startup() {
  model = await blazeface.load();
  setInterval(() => {
    faceDetection();
  }, 30);
  video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    setInterval(() => {
      faceDetection();
    }, 30);
  });
}

// Camera setup is done
setupCamera();
startup();
