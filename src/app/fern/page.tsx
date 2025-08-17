'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FernPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [iterations, setIterations] = useState(50000);
  const [scale, setScale] = useState(80);
  const [colorVariation, setColorVariation] = useState(1);
  const [animated, setAnimated] = useState(false);

  // Barnsley Fern affine transformations with probabilities
  const fernTransformations = [
    // f1: 85% - Main structure (stem and leaflets)
    {
      probability: 0.85,
      transform: (x: number, y: number) => ({
        x: 0.85 * x + 0.04 * y,
        y: -0.04 * x + 0.85 * y + 1.6
      })
    },
    // f2: 7% - Bottom left leaflet
    {
      probability: 0.92, // Cumulative: 0.85 + 0.07
      transform: (x: number, y: number) => ({
        x: 0.2 * x - 0.26 * y,
        y: 0.23 * x + 0.22 * y + 1.6
      })
    },
    // f3: 7% - Bottom right leaflet
    {
      probability: 0.99, // Cumulative: 0.92 + 0.07
      transform: (x: number, y: number) => ({
        x: -0.15 * x + 0.28 * y,
        y: 0.26 * x + 0.24 * y + 0.44
      })
    },
    // f4: 1% - Stem
    {
      probability: 1.0, // Remaining 1%
      transform: (x: number, y: number) => ({
        x: 0,
        y: 0.16 * y
      })
    }
  ];

  // Generate Barnsley Fern points
  const generateFernPoints = () => {
    const points: { x: number; y: number }[] = [];
    let x = 0;
    let y = 0;

    for (let i = 0; i < iterations; i++) {
      const random = Math.random();
      
      // Select transformation based on probability
      let selectedTransform = fernTransformations[0];
      for (const transformation of fernTransformations) {
        if (random <= transformation.probability) {
          selectedTransform = transformation;
          break;
        }
      }
      
      // Apply the selected transformation
      const newPoint = selectedTransform.transform(x, y);
      x = newPoint.x;
      y = newPoint.y;
      
      points.push({ x, y });
    }
    
    return points;
  };

  // Draw the Barnsley Fern
  const drawFern = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 50;
    
    points.forEach((point, index) => {
      // Transform coordinates to screen space
      const screenX = centerX + point.x * scale;
      const screenY = centerY - point.y * scale;
      
      // Color based on position and variation setting
      let hue: number;
      switch (colorVariation) {
        case 1: // Green variations
          hue = 120 + (point.y * 15) + Math.sin(point.x * 10) * 20;
          break;
        case 2: // Autumn colors
          hue = 30 + (point.y * 20) + Math.sin(point.x * 5) * 30;
          break;
        case 3: // Purple/blue variations
          hue = 240 + (point.y * 10) + Math.sin(point.x * 8) * 25;
          break;
        default:
          hue = 120; // Standard green
      }
      
      const saturation = 70 + Math.sin(index * 0.01) * 30;
      const lightness = 30 + (point.y * 8) + Math.sin(point.x * 12) * 20;
      
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${Math.max(20, Math.min(70, lightness))}%)`;
      
      // Draw point (small circle for better visibility)
      ctx.beginPath();
      ctx.arc(screenX, screenY, 0.8, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const redrawFern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate and draw fern points
    const points = generateFernPoints();
    drawFern(ctx, points);

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name}'s Fern Fractal`, canvas.width / 2 + 2, 42);
      
      // Main text in dark color for contrast
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`${name}'s Fern Fractal`, canvas.width / 2, 40);
    }

    // Add educational text
    ctx.font = '13px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Each point follows one of four mathematical rules - just like real fern growth!', 10, canvas.height - 10);
  };

  useEffect(() => {
    redrawFern();
  }, [name, iterations, scale, colorVariation]);

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
            <title>${name ? name + "'s " : ''}Fern Fractal</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Fern Fractal Pattern" />
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-green-600 hover:text-green-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-green-900 mb-2">🌿 Fern Fractal Generator 🌿</h1>
          <p className="text-lg text-gray-700">Create the famous Barnsley Fern using mathematical transformations found in nature!</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🎨 Fern Controls</h2>
            
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

              {/* Iterations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Level: {(iterations / 1000).toFixed(0)}k points
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="10000"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">More points create a more detailed fern</p>
              </div>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fern Size: {scale}
                </label>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Overall size of the fern</p>
              </div>

              {/* Color Variation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <select
                  value={colorVariation}
                  onChange={(e) => setColorVariation(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                >
                  <option value={1}>Forest Green</option>
                  <option value={2}>Autumn Colors</option>
                  <option value={3}>Mystical Purple</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Different color schemes for your fern</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Fern
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-green-700 mb-2">
                The Barnsley Fern uses just 4 mathematical rules (affine transformations) to create a realistic fern pattern! 
                Each point is created by randomly selecting one of these rules.
              </p>
              <p className="text-sm text-green-700">
                Real ferns grow using similar branching rules, making this one of the most beautiful examples of math in nature.
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