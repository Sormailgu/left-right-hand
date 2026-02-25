import { useEffect, useState } from 'react';

export function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active && particles.length === 0) {
      const newParticles = Array.from({ length: 50 }, () => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        color: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B'][Math.floor(Math.random() * 4)],
      }));
      setParticles(newParticles);

      const interval = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              rotation: p.rotation + 2,
            }))
            .filter((p) => p.y < 110)
        );
      }, 16);

      return () => clearInterval(interval);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: '10px',
            height: '10px',
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}
