'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SnowflakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [symmetry, setSymmetry] = useState(6);
  const [depth, setDepth] = useState(4);
  const [size, setSize] = useState(180);
  const [branchAngle, setBranchAngle] = useState(60);
  const [branchLength, setBranchLength] = useState(0.4);

  // Koch snowflake segment drawing function
  const drawKochSegment = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, depth: number) => {
    if (depth === 0) {
      ctx.lineTo(x2, y2);
      return;
    }

    // Calculate the segment length and direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Divide the segment into three parts
    const x3 = x1 + dx / 3;
    const y3 = y1 + dy / 3;
    const x4 = x1 + 2 * dx / 3;
    const y4 = y1 + 2 * dy / 3;
    
    // Calculate the peak of the triangle
    const angle = Math.atan2(dy, dx) - Math.PI / 3;
    const length = Math.sqrt(dx * dx + dy * dy) / 3;
    const x5 = x3 + length * Math.cos(angle);
    const y5 = y3 + length * Math.sin(angle);
    
    // Recursively draw the four segments
    drawKochSegment(ctx, x1, y1, x3, y3, depth - 1);
    drawKochSegment(ctx, x3, y3, x5, y5, depth - 1);
    drawKochSegment(ctx, x5, y5, x4, y4, depth - 1);
    drawKochSegment(ctx, x4, y4, x2, y2, depth - 1);
  };

  // Dendritic branch drawing function
  const drawDendriticBranch = (ctx: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, depth: number) => {
    if (depth === 0 || length < 2) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.lineTo(endX, endY);

    // Create branching at various points along the main line
    for (let i = 0.3; i <= 1; i += 0.3) {
      const branchX = x + (endX - x) * i;
      const branchY = y + (endY - y) * i;
      
      const newLength = length * branchLength * (1.2 - i);
      const leftAngle = angle + (branchAngle * Math.PI / 180);
      const rightAngle = angle - (branchAngle * Math.PI / 180);

      ctx.moveTo(branchX, branchY);
      drawDendriticBranch(ctx, branchX, branchY, newLength, leftAngle, depth - 1);
      
      ctx.moveTo(branchX, branchY);
      drawDendriticBranch(ctx, branchX, branchY, newLength, rightAngle, depth - 1);
      
      ctx.moveTo(endX, endY);
    }
  };

  const drawSnowflake = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Set drawing style
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw snowflake with specified symmetry
    for (let i = 0; i < symmetry; i++) {
      const angle = (2 * Math.PI * i) / symmetry;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      
      // Main branch
      const mainEndX = centerX + Math.cos(angle) * size;
      const mainEndY = centerY + Math.sin(angle) * size;
      
      if (depth <= 2) {
        // Simple geometric pattern for low depth
        ctx.lineTo(mainEndX, mainEndY);
        
        // Add decorative elements
        const midX = centerX + Math.cos(angle) * size * 0.5;
        const midY = centerY + Math.sin(angle) * size * 0.5;
        
        const sideLength = size * 0.3;
        const sideAngle1 = angle + Math.PI / 3;
        const sideAngle2 = angle - Math.PI / 3;
        
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + Math.cos(sideAngle1) * sideLength, midY + Math.sin(sideAngle1) * sideLength);
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + Math.cos(sideAngle2) * sideLength, midY + Math.sin(sideAngle2) * sideLength);
      } else {
        // Complex dendritic pattern for higher depth
        drawDendriticBranch(ctx, centerX, centerY, size, angle, depth);
      }
      
      ctx.stroke();
    }

    // Add center decoration
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e40af';
    ctx.fill();

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(`${name}'s Snowflake`, centerX + 2, 42);
      
      // Main text
      ctx.fillStyle = '#1e40af';
      ctx.fillText(`${name}'s Snowflake`, centerX, 40);
    }

    // Add educational text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Every snowflake has 6-fold symmetry but infinite variety!', 10, canvas.height - 10);
  };

  useEffect(() => {
    drawSnowflake();
  }, [name, symmetry, depth, size, branchAngle, branchLength]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas is fully rendered before printing
    setTimeout(() => {
      const dataUrl = canvas.toDataURL();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>${name ? name + "'s " : ''}Snowflake</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Fractal Snowflake" />
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Small delay before printing to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
      }, 100);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">❄️ Snowflake Fractal Generator ❄️</h1>
          <p className="text-lg text-gray-700">Create your own unique snowflake! No two snowflakes are alike, but they all follow mathematical patterns.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">❄️ Snowflake Controls</h2>
            
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name here!"
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Symmetry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symmetry: {symmetry}-fold
                </label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={symmetry}
                  onChange={(e) => setSymmetry(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Natural snowflakes have 6-fold symmetry</p>
              </div>

              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Level: {depth}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How detailed the snowflake pattern is</p>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="80"
                  max="250"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Radius of the snowflake</p>
              </div>

              {/* Branch Angle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Angle: {branchAngle}°
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={branchAngle}
                  onChange={(e) => setBranchAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Angle of side branches</p>
              </div>

              {/* Branch Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Length: {Math.round(branchLength * 100)}%
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.7"
                  step="0.1"
                  value={branchLength}
                  onChange={(e) => setBranchLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Length of side branches relative to main branch</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Snowflake
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-blue-700">
                Real snowflakes form when water vapor freezes around particles in clouds. 
                They grow in 6-fold symmetry because of the hexagonal structure of ice crystals.
                Temperature and humidity affect their shape!
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border border-gray-200 rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}