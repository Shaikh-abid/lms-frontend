import { useEffect, useState } from 'react';

const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      'hsl(245, 58%, 51%)',
      'hsl(24, 95%, 53%)',
      'hsl(142, 76%, 36%)',
      'hsl(280, 65%, 55%)',
      'hsl(340, 82%, 52%)',
      'hsl(45, 93%, 47%)',
    ];

    const newParticles = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -50 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 2,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `fall 4s ease-in ${particle.delay}s forwards`,
          }}
        >
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: particle.color,
              clipPath: Math.random() > 0.5 
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
