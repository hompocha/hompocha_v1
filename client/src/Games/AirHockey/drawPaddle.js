function drawPaddle(x_value, y_value, paddleCtx, canvasRef) {
  const paddleW = 40;
  const paddleH = 140;
  paddleCtx.current.beginPath();
  paddleCtx.current.clearRect(
    0,
    0,
    canvasRef.current.width,
    canvasRef.current.height
  );
  paddleCtx.current.fillRect(
    x_value * canvasRef.current.width - paddleW / 2,
    y_value * canvasRef.current.height - paddleH / 2,
    paddleW,
    paddleH
  );
  paddleCtx.current.fill();
  paddleCtx.current.fillStyle = "tomato";
  paddleCtx.current.closePath();
}

export { drawPaddle };
