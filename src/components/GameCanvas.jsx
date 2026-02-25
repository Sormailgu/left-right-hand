import { useEffect, useRef, useState, useCallback } from 'react';
import { useMultiTouch } from '../hooks/useMultiTouch';
import { recognizeShape } from '../game/shapes';

export function GameCanvas({ level, onRecognize, onTimerEnd, timeLimit }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [leftRecognized, setLeftRecognized] = useState(false);
  const [rightRecognized, setRightRecognized] = useState(false);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }, []);

  function drawCanvas(activeTouches) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw dividing line
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvasRef.current.width / 2, 0);
    ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw each touch path
    for (let [id, touch] of Object.entries(activeTouches)) {
      const isLeft = touch.x < canvasRef.current.width / 2;
      ctx.strokeStyle = isLeft ? '#FFD93D' : '#6BCB77';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      touch.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }

  function checkShapes(endedTouches) {
    const touchArray = Object.entries(endedTouches);
    if (touchArray.length === 0) return;

    const canvas = canvasRef.current;

    for (let [id, touch] of touchArray) {
      const isLeft = touch.x < canvas.width / 2;
      const targetShape = isLeft ? level.left : level.right;
      const result = recognizeShape(touch.points);

      if (result && result.shape === targetShape) {
        if (isLeft) setLeftRecognized(true);
        else setRightRecognized(true);
      }
    }

    // Clear canvas after recognition
    if (leftRecognized || rightRecognized) {
      setTimeout(() => {
        clearCanvas();
      }, 100);
    }
  }

  const { touchHandlers, touches, clearCanvas } = useMultiTouch(
    (activeTouches) => {
      drawCanvas(activeTouches);
    },
    (endedTouches) => {
      checkShapes(endedTouches);
    }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
      resizeCanvas();
    }
  }, [resizeCanvas]);

  useEffect(() => {
    if (leftRecognized && rightRecognized) {
      onRecognize(true);
    }
  }, [leftRecognized, rightRecognized, onRecognize]);

  return (
    <canvas
      ref={canvasRef}
      {...touchHandlers}
      className="w-full h-96 bg-white rounded-3xl shadow-lg border-4 border-chocolate"
    />
  );
}
