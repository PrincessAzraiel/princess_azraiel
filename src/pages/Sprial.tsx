import React, { useEffect, useRef, useState } from 'react';

const phrases: string[] = [
  'Relax and focus...',
  'Feel yourself drifting...',
  'Your mind is open...',
  'Deeper and deeper...',
  'You are calm and peaceful...',
  'Let the spiral guide you...',
];

const HypnoSpiral: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [textVisible, setTextVisible] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number;
    let height: number;
    let centerX: number;
    let centerY: number;
    let time = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);

      centerX = width / 2;
      centerY = height / 2;
    }

    function drawSpiral() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();

      const turns = 20;
      const spacing = 8;
      const rotationSpeed = 0.02;

      for (let i = 0; i < turns * 360; i++) {
        const angle = (i + time) * (Math.PI / 180);
        const radius = spacing * angle;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      time += rotationSpeed;
      animationRef.current = requestAnimationFrame(drawSpiral);
    }

    resize();
    drawSpiral();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % phrases.length);
        setTextVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10 px-4 max-w-xl text-center">
        <p
          className={`text-white text-3xl md:text-5xl font-semibold transition-opacity duration-500 ${
            textVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {phrases[textIndex]}
        </p>
      </div>
    </div>
  );
};

export default HypnoSpiral;
