'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function TreePageContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [angle, setAngle] = useState(25);
  const [depth, setDepth] = useState(8);
  const [branches, setBranches] = useState(2);
  const [length, setLength] = useState(100);

  // Fractal tree drawing function
  const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, currentAngle: number, depth: number) => {
    if (depth === 0) return;

    // Calculate end point of current branch
    const endX = x + Math.cos(currentAngle * Math.PI / 180) * len;
    const endY = y + Math.sin(currentAngle * Math.PI / 180) * len;

    // Set line style based on depth for visual variety
    ctx.strokeStyle = depth > 4 ? '#8B4513' : '#228B22';
    ctx.lineWidth = depth * 0.5;
    
    // Draw the branch
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Calculate uniform branch distribution
    const totalSpread = angle; // The angle parameter controls total spread
    const angleStep = branches > 1 ? totalSpread / (branches - 1) : 0;
    const startAngle = currentAngle - totalSpread / 2;

    // Recursively draw sub-branches with uniform distribution
    for (let i = 0; i < branches; i++) {
      const branchAngle = startAngle + (i * angleStep);
      drawTree(ctx, endX, endY, len * 0.7, branchAngle, depth - 1);
    }
  };

  const redrawTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the tree starting from bottom center
    const startX = canvas.width / 2;
    const startY = canvas.height - 50;
    
    drawTree(ctx, startX, startY, length, -90, depth);

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name}'s Fractal Tree`, canvas.width / 2 + 2, 42);
      
      // Main text in dark color for contrast
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`${name}'s Fractal Tree`, canvas.width / 2, 40);
    }

    // Add educational text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Notice how the pattern repeats at each level!', 10, canvas.height - 10);
  }, [name, angle, depth, branches, length, drawTree]);

  useEffect(() => {
    redrawTree();
  }, [name, angle, depth, branches, length, redrawTree]);

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
            <title>${name ? name + "'s " : ''}Fractal Tree</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Fractal Tree" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🌳 Fractal Tree Generator 🌳</h1>
          <p className="text-lg text-gray-700">Discover patterns in nature! Create your own fractal tree by adjusting the controls below.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">🎨 Tree Controls</h2>
            
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

              {/* Branch Angle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Angle: {angle}°
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How wide the branches spread</p>
              </div>

              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tree Depth: {depth} levels
                </label>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How many levels deep the pattern repeats</p>
              </div>

              {/* Number of Branches */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branches per Node: {branches}
                </label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  value={branches}
                  onChange={(e) => setBranches(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How many branches grow from each point</p>
              </div>

              {/* Branch Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Branch Length: {length}px
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Length of the main trunk</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Tree
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-blue-700">
                Fractals are patterns that repeat at every scale! Trees, ferns, and many other things in nature follow fractal patterns.
                Notice how each branch looks like a smaller version of the whole tree!
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

export default function TreePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-blue-600">Loading your fractal tree...</p>
      </div>
    </div>}>
      <TreePageContent />
    </Suspense>
  );
}