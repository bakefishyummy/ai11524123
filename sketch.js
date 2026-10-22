
let classifier;

// Model URL：模型所在的位置
let imageModelURL = 'https://bakefishyummy.github.io/ai11524123/';

let video;
let label = "載入模型中...";
let canvasSize = 320;

function preload() {
  classifier = ml5.imageClassifier(
    imageModelURL + 'model.json'
  );
}

function setup() {
  canvasSize = min(windowWidth - 32, 640);
  canvasSize = max(canvasSize, 200);

  createCanvas(canvasSize, canvasSize);

  // 使用手機後置鏡頭
  let constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  };

  video = createCapture(
    constraints,
    function () {
      classifyVideo();
    }
  );

  video.size(320, 320);
  video.hide();
}

function draw() {
  background(0);

  if (video && video.elt.readyState >= 2) {
    image(video, 0, 0, width, height);
  }

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 10);
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    label = "辨識發生錯誤";
    return;
  }

  if (results && results.length > 0) {
    label = results[0].label;
  }

  classifyVideo();
}

function windowResized() {
  canvasSize = min(windowWidth - 32, 640);
  canvasSize = max(canvasSize, 200);

  resizeCanvas(canvasSize, canvasSize);
}
