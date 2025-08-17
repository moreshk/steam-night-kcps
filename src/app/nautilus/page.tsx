'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NautilusPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [turns, setTurns] = useState(4);
  const [growth, setGrowth] = useState(0.2);
  const [chambers, setChambers] = useState(12);
  const [size, setSize] = useState(150);

  // Golden ratio - key to nautilus spirals
  const PHI = (1 + Math.sqrt(5)) / 2;

  // Nautilus spiral drawing function
  const drawNautilus = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const totalPoints = turns * 100; // Points per turn for smooth curve
    const angleIncrement = (2 * Math.PI) / 100; // Angle increment per point

    // Draw the main spiral
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;

    for (let i = 0; i <= totalPoints; i++) {
      const angle = i * angleIncrement;
      // Logarithmic spiral: r = a * φ^(θ/π)
      const radius = size * Math.pow(PHI, angle * growth / Math.PI);
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw chamber dividers
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    
    for (let chamber = 1; chamber <= chambers; chamber++) {
      const chamberAngle = (chamber / chambers) * turns * 2 * Math.PI;
      const chamberRadius = size * Math.pow(PHI, chamberAngle * growth / Math.PI);
      
      const startX = centerX;
      const startY = centerY;
      const endX = centerX + chamberRadius * Math.cos(chamberAngle);
      const endY = centerY + chamberRadius * Math.sin(chamberAngle);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw outer shell outline
    ctx.beginPath();
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    
    const outerPoints = turns * 50;
    for (let i = 0; i <= outerPoints; i++) {
      const angle = i * (2 * Math.PI) / 50;
      const radius = size * Math.pow(PHI, angle * growth / Math.PI);
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Add golden ratio visualization
    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Golden Ratio: φ ≈ ${PHI.toFixed(3)}`, 10, 30);
  };

  const redrawNautilus = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the nautilus spiral from center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    drawNautilus(ctx, centerX, centerY);

    // Draw the name
    if (name.trim()) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Add text shadow for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${name}'s Nautilus Shell`, canvas.width / 2 + 2, canvas.height - 32);
      
      // Main text in dark color for contrast
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`${name}'s Nautilus Shell`, canvas.width / 2, canvas.height - 34);
    }

    // Add educational text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText('Each chamber follows the golden ratio spiral pattern!', 10, canvas.height - 10);
  };

  useEffect(() => {
    redrawNautilus();
  }, [name, turns, growth, chambers, size]);

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
            <title>${name ? name + "'s " : ''}Nautilus Shell</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Nautilus Shell Spiral" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800 underline">
            ← Back to Pattern Selection
          </Link>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🐚 Nautilus Shell Spiral Generator 🐚</h1>
          <p className="text-lg text-gray-700">Explore the golden ratio in nature! Create your own nautilus shell by adjusting the controls below.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">🎨 Spiral Controls</h2>
            
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

              {/* Number of Turns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spiral Turns: {turns}
                </label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={turns}
                  onChange={(e) => setTurns(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How many complete rotations the spiral makes</p>
              </div>

              {/* Growth Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Rate: {growth.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.01"
                  value={growth}
                  onChange={(e) => setGrowth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How quickly the spiral expands outward</p>
              </div>

              {/* Number of Chambers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shell Chambers: {chambers}
                </label>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={chambers}
                  onChange={(e) => setChambers(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Number of chambers in the shell</p>
              </div>

              {/* Shell Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shell Size: {size}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Overall size of the shell</p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🖨️ Print My Shell
              </button>
            </div>

            {/* Educational Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔬 Did You Know?</h3>
              <p className="text-sm text-blue-700">
                The nautilus shell follows a perfect logarithmic spiral based on the golden ratio (φ ≈ 1.618)! 
                This same mathematical pattern appears in galaxies, hurricanes, and even sunflower seeds. 
                Nature loves this efficient and beautiful spiral pattern!
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