
let classifier;

let imageModelURL =
  'https://bakefishyummy.github.io/ai11524123/';

let video;
let label = "正在載入模型……";
let canvasSize = 320;
let isClassifying = false;

function preload() {
  classifier = ml5.imageClassifier(
    imageModelURL + 'model.json'
  );
}

function setup() {
  canvasSize = Math.max(
    200,
    Math.min(windowWidth - 32, 640)
  );

  createCanvas(canvasSize, canvasSize);

  // 使用後置鏡頭；不強制指定 exact
  let constraints = {
    audio: false,
    video: {
      facingMode: "environment",
      width: { ideal: 320 },
      height: { ideal: 320 }
    }
  };

  // 建立攝影機
  video = createCapture(
    constraints,
    function () {
      document.getElementById("status").textContent =
        "攝影機已啟動，準備辨識";

      classifyVideo();
    }
  );

  video.size(320, 320);
  video.hide();
}

function draw() {
  background(0);

  // 顯示攝影機影像
  if (video && video.elt.readyState >= 2) {
    image(video, 0, 0, width, height);
  }

  // 顯示辨識結果
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(16);
  textAlign(CENTER, CENTER);

  text(
    label,
    width / 2,
    height - 20,
    width - 16,
    40
  );
}

function classifyVideo() {
  if (isClassifying || !video) {
    return;
  }

  isClassifying = true;

  // 直接使用原始影像，不再呼叫 flipImage
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  isClassifying = false;

  if (error) {
    console.error("辨識錯誤：", error);
    label = "辨識失敗，請查看 Console";
    document.getElementById("status").textContent =
      "辨識失敗，請查看主控台錯誤";
    return;
  }

  if (results && results.length > 0) {
    label = results[0].label;

    document.getElementById("status").textContent =
      "辨識結果：" + results[0].label;
  }

  // 繼續辨識下一張影像
  classifyVideo();
}

function windowResized() {
  canvasSize = Math.max(
    200,
    Math.min(windowWidth - 32, 640)
  );

  resizeCanvas(canvasSize, canvasSize);
}
