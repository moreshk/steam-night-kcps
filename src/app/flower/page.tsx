'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FlowerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [seedCount, setSeedCount] = useState(150);
  const [seedSize, setSeedSize] = useState(4);
  const [growth, setGrowth] = useState(8);
  const [centerSize, setCenterSize] = useState(20);

  // Golden angle in degrees - key to flower spiral patterns
  const GOLDEN_ANGLE = 137.508;

  // Flower spiral drawing function using Fibonacci phyllotaxis
  const drawFlowerSpiral = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Draw background disc for the flower center
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw each seed using polar coordinates
    for (let i = 0; i < seedCount; i++) {
      // Calculate angle using golden angle
      const angle = i * GOLDEN_ANGLE * Math.PI / 180;
      
      // Calculate radius - seeds spread out as they get further from center
      const radius = growth * Math.sqrt(i);
      
      // Convert to cartesian coordinates
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Calculate seed size - smaller near center, larger towards edge
      const currentSeedSize = seedSize * (1 + i * 0.01);
      
      // Color gradient from center (dark) to edge (bright)
      const intensity = Math.min(255, 100 + (i * 2));
      const hue = (30 + i * 0.5) % 60; // Yellow to orange range
      ctx.fillStyle = `hsl(${hue}, 90%, ${Math.min(70, 30 + (i * 0.3))}%)`;
      
      // Draw the seed
      ctx.beginPath();
      ctx.arc(x, y, currentSeedSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add small outline for definition
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw Fibonacci spiral guides (optional - for educational purposes)
    if (seedCount >= 100) {
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.lineWidth = 1;
      
      // Draw a few prominent spirals
      const spiralCount = Math.floor(Math.sqrt(seedCount / 10));
      for (let s = 0; s < spiralCount; s++) {
        ctx.beginPath();
        let firstPoint = true;
        
        for (let i = s; i < seedCount; i += spiralCount) {
          const angle = i * GOLDEN_ANGLE * Math.PI / 180;
          const radius = growth * Math.sqrt(i);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    }

    // Add golden angle and Fibonacci information
    ctx.fillStyle = '#228B22';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Golden Angle: ${GOLDEN_ANGLE.toFixed(1)}°`, 10, 25);
    ctx.fillText(`Fibonacci spirals visible: ${Math.floor(Math.sqrt(seedCount / 10))}`, 10, 45);
  };

  const redrawFlower = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the flower spiral from center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    drawFlowerSpiral(ctx, centerX, centerY);

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name}'s Flower Spiral`, canvas.width / 2 + 2, canvas.height - 32);
      
      // Main text in dark color for contrast
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`${name}'s Flower Spiral`, canvas.width / 2, canvas.height - 34);
    }

    // Add educational text
    ctx.font = '13px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Seeds follow the golden angle - the most efficient packing pattern in nature!', 10, canvas.height - 10);
  };

  useEffect(() => {
    redrawFlower();
  }, [name, seedCount, seedSize, growth, centerSize]);

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
            <title>${name ? name + "'s " : ''}Flower Spiral</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Flower Spiral Pattern" />
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-green-600 hover:text-green-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-green-900 mb-2">🌻 Flower Spiral Generator 🌻</h1>
          <p className="text-lg text-gray-700">Discover Fibonacci spirals in nature! Create your own flower pattern using the golden angle.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🎨 Flower Controls</h2>
            
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
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Seed Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seeds: {seedCount}
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={seedCount}
                  onChange={(e) => setSeedCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">More seeds show clearer Fibonacci spiral patterns</p>
              </div>

              {/* Seed Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed Size: {seedSize}px
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={seedSize}
                  onChange={(e) => setSeedSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Size of individual seeds</p>
              </div>

              {/* Growth Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spiral Growth: {growth}
                </label>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={growth}
                  onChange={(e) => setGrowth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How quickly seeds spread outward</p>
              </div>

              {/* Center Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flower Center: {centerSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={centerSize}
                  onChange={(e) => setCenterSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Size of the flower center disc</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Flower
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-green-700 mb-2">
                Sunflower seeds arrange themselves using the golden angle (137.508°) - the most efficient packing pattern! 
                This creates beautiful Fibonacci spirals going in both directions.
              </p>
              <p className="text-sm text-green-700">
                You can count 21, 34, 55, or even 89 spirals - all Fibonacci numbers! Nature is full of mathematical patterns.
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