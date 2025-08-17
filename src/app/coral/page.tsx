'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CoralPageContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [depth, setDepth] = useState(6);
  const [curvature, setCurvature] = useState(0.4);

  // Draw Staghorn Coral - cylindrical branching structure
  const drawStaghornCoral = (ctx: CanvasRenderingContext2D, startX: number, startY: number, angle: number, length: number, depth: number, width: number) => {
    if (depth <= 0 || length < 8) return;

    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    // Draw cylindrical branch with gradient
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, `hsl(25, 85%, ${65 - depth * 3}%)`);
    gradient.addColorStop(0.5, `hsl(30, 90%, ${70 - depth * 2}%)`);
    gradient.addColorStop(1, `hsl(20, 80%, ${60 - depth * 4}%)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Add polyp texture along the branch
    for (let i = 0; i < length / 8; i++) {
      const polypX = startX + (endX - startX) * (i / (length / 8)) + (Math.random() - 0.5) * width * 0.3;
      const polypY = startY + (endY - startY) * (i / (length / 8)) + (Math.random() - 0.5) * width * 0.3;
      
      ctx.fillStyle = `hsl(35, 70%, ${75 - depth * 2}%)`;
      ctx.beginPath();
      ctx.arc(polypX, polypY, width * 0.15, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Branch at the end (staghorns fork at tips)
    if (depth > 1 && Math.random() < 0.7) {
      const numForks = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numForks; i++) {
        const forkAngle = angle + (i - 0.5) * (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
        const forkLength = length * (0.6 + Math.random() * 0.2);
        const forkWidth = width * (0.7 + Math.random() * 0.1);
        
        drawStaghornCoral(ctx, endX, endY, forkAngle, forkLength, depth - 1, Math.max(2, forkWidth));
      }
    }
  };

  // Draw staghorn coral structure
  const drawCoral = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const baseY = centerY + 150;
    
    // Draw coral base
    ctx.fillStyle = 'hsl(30, 50%, 40%)';
    ctx.beginPath();
    ctx.ellipse(centerX, baseY, 20, 12, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Create main staghorn branches
    const numMainBranches = Math.max(2, Math.floor(depth / 2));
    for (let i = 0; i < numMainBranches; i++) {
      const angle = -Math.PI / 2 + (i - (numMainBranches - 1) / 2) * (Math.PI / 3);
      const length = 70 + Math.random() * 30;
      const width = 8 + Math.random() * 4;
      
      const startX = centerX + (Math.random() - 0.5) * 15;
      const startY = baseY - 5 + (Math.random() - 0.5) * 10;
      
      drawStaghornCoral(ctx, startX, startY, angle, length, depth, width);
    }
  };

  const redrawCoral = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clear canvas completely for clean coral patterns
    // No background - let the corals stand out on transparent background

    // Draw the coral from center-bottom
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    drawCoral(ctx, centerX, centerY);

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name}'s Coral Reef`, canvas.width / 2 + 2, 42);
      
      // Main text in dark color for contrast
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`${name}'s Coral Reef`, canvas.width / 2, 40);
    }

    // Add educational text
    ctx.font = '13px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Staghorn corals branch like antlers to catch plankton and maximize sunlight exposure!', 10, canvas.height - 10);
  };

  useEffect(() => {
    redrawCoral();
  }, [name, depth, curvature]);

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
            <title>${name ? name + "'s " : ''}Coral Reef</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Coral Fractal Pattern" />
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-cyan-600 hover:text-cyan-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-cyan-900 mb-2">🪸 Staghorn Coral Generator 🪸</h1>
          <p className="text-lg text-gray-700">Explore the fractal branching patterns of staghorn corals and their antler-like growth!</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-cyan-800 mb-6">🎨 Staghorn Controls</h2>
            
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
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              {/* Growth Depth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coral Complexity: {depth} levels
                </label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How many levels of branching growth</p>
              </div>

              {/* Growth Curvature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organic Growth: {(curvature * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.1"
                  value={curvature}
                  onChange={(e) => setCurvature(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How curved and natural the growth appears</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Coral
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-cyan-700 mb-2">
                Staghorn corals grow like underwater antlers with cylindrical branches that fork at the tips! 
                This branching pattern maximizes surface area for catching plankton and absorbing sunlight.
              </p>
              <p className="text-sm text-cyan-700">
                The same mathematical branching principles appear in trees, blood vessels, and river deltas - nature loves efficient growth patterns!
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

export default function CoralPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto"></div>
        <p className="mt-4 text-cyan-600">Loading your coral reef...</p>
      </div>
    </div>}>
      <CoralPageContent />
    </Suspense>
  );
}