/* function drawHand(predictions, ctx) {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = landmarks[i][0];
        // Get y point
        const y = landmarks[i][1];
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
      }
    });
  }
} */
const paddleW = 20;
const paddleH = 100;
function drawHand(predictions, ctx) {
  // Check if we have predictions
  if (predictions.length > 0) {
    console.log(predictions[0].landmarks[8][0]);
    const x = predictions[0].landmarks[8][0];
    const y = predictions[0].landmarks[8][1];
    ctx.beginPath();
    ctx.fill();
    ctx.fillStyle = "tomato";
    ctx.fillRect(x - paddleW / 2, y - paddleH / 2, paddleW, paddleH);
    ctx.closePath();
  }
}

export default drawHand;
