import { useEffect, useRef } from "react";

const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let numParticles;
    let connectDistance;

    // A single function to set up and reset the animation
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Responsive logic based on screen width
      if (canvas.width < 768) { // Mobile devices
        numParticles = 35;
        connectDistance = 85;
      } else { // Desktop
        numParticles = 80;
        connectDistance = 100;
      }

      // Re-create particles for the new size
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const width = () => canvas.width;
    const height = () => canvas.height;

    class Particle {
      constructor() {
        this.x = Math.random() * width();
        this.y = Math.random() * height();
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
      }

      move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width()) this.vx *= -1;
        if (this.y < 0 || this.y > height()) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      }
    }

    let animationFrameId;
    const animate = () => {
      ctx.fillStyle = "#17153B";
      ctx.fillRect(0, 0, width(), height());

      particles.forEach((p, i) => {
        p.move();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Use the dynamic connectDistance
          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initial setup
    setup();
    animate();

    // Update on resize
    window.addEventListener("resize", setup);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", setup);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh"
      }}
    />
  );
};

export default CanvasBackground;