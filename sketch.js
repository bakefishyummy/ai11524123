
/*
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
*/

// Classifier Variable
let classifier;

// Model URL
let imageModelURL = 'https://bakefishyummy.github.io/ai11524123/';

// Video
let video;
let flippedVideo;

// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 320);

  // Create the video using the rear camera
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  };

  video = createCapture(constraints);
  video.size(320, 320);
  video.hide();

  // Start classifying after the camera is ready
  video.elt.onloadeddata = function() {
    classifyVideo();
  };
}

function draw() {
  background(0);

  // Draw the video
  if (video) {
    image(video, 0, 0, 320, 320);
  }

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // The results are ordered by confidence
  label = results[0].label;

  // Classify again
  classifyVideo();
}
