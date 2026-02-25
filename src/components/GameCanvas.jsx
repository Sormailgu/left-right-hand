import { useEffect, useRef, useState, useCallback } from 'react';
import { useMultiTouch } from '../hooks/useMultiTouch';
import { recognizeShape, calculateRealTimeConfidence, recognizeShapeWithProgress } from '../game/shapes';
import { useGameStore } from '../game/gameState';

export function GameCanvas({ level, onRecognize, onTimerEnd, timeLimit }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [leftRecognized, setLeftRecognized] = useState(false);
  const [rightRecognized, setRightRecognized] = useState(false);
  const { updateConfidence, setRecognizedShape, addAttempt } = useGameStore();

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

    // Draw each touch path with color-coded feedback
    for (let [id, touch] of Object.entries(activeTouches)) {
      const isLeft = touch.x < canvasRef.current.width / 2;
      const side = isLeft ? 'left' : 'right';
      const targetShape = isLeft ? level.left : level.right;

      // Calculate real-time confidence
      const feedback = calculateRealTimeConfidence(touch.points, targetShape);
      updateConfidence(side, feedback.confidence);

      // Color based on confidence: green ≥70%, yellow ≥40%, red <40%
      const strokeColor = feedback.confidence >= 70 ? '#22c55e' :  // green
                          feedback.confidence >= 40 ? '#facc15' :  // yellow
                          '#ef4444';  // red

      ctx.strokeStyle = strokeColor;
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
      const side = isLeft ? 'left' : 'right';
      const targetShape = isLeft ? level.left : level.right;

      // Use progressive recognition with difficulty thresholds
      const result = recognizeShapeWithProgress(
        touch.points,
        targetShape,
        level.difficulty
      );

      if (result.recognized) {
        setRecognizedShape(side, true);
        if (isLeft) setLeftRecognized(true);
        else setRightRecognized(true);
      }

      // Store attempt for feedback
      const attempt = {
        shape: result.shape,
        confidence: result.confidence,
        recognized: result.recognized,
        side,
        timestamp: Date.now(),
      };
      addAttempt(attempt);
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
      className="w-full h-canvas-mobile md:h-canvas-desktop bg-white rounded-3xl shadow-lg border-4 border-chocolate"
    />
  );
}
