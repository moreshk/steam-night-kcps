'use client';

import Link from 'next/link';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nature&apos;s Fractal Patterns
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore the beautiful mathematical patterns found in nature
          </p>

        </div>

        {/* Pattern Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tree Pattern Card */}
          <Link 
            href="/tree"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-green-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🌳</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Fractal Trees
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore the branching patterns found in trees, rivers, and lightning. 
                  Watch how simple rules create complex, natural-looking structures.
                </p>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium group-hover:bg-green-200 transition-colors">
                  Create Tree Pattern →
                </div>
              </div>
            </div>
          </Link>

          {/* Snowflake Pattern Card */}
          <Link 
            href="/snowflake"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200">
              <div className="text-center">
                <div className="text-6xl mb-4">❄️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Snowflake Fractals
                </h2>
                <p className="text-gray-600 mb-6">
                  Discover the six-fold symmetry and infinite variety of snowflakes. 
                  No two snowflakes are alike, yet they all follow the same mathematical rules.
                </p>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium group-hover:bg-blue-200 transition-colors">
                  Create Snowflake Pattern →
                </div>
              </div>
            </div>
          </Link>

          {/* Nautilus Pattern Card */}
          <Link 
            href="/nautilus"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🐚</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Nautilus Shell Spirals
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore the perfect logarithmic spirals found in nautilus shells. 
                  These spirals follow the golden ratio, creating nature&apos;s most elegant curves.
                </p>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium group-hover:bg-blue-200 transition-colors">
                  Create Spiral Pattern →
                </div>
              </div>
            </div>
          </Link>

          {/* Flower Pattern Card */}
          <Link 
            href="/flower"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-yellow-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🌻</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Flower Spirals
                </h2>
                <p className="text-gray-600 mb-6">
                  Discover Fibonacci spirals in sunflowers and daisies. 
                  Seeds arrange using the golden angle for perfect packing efficiency.
                </p>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium group-hover:bg-yellow-200 transition-colors">
                  Create Flower Pattern →
                </div>
              </div>
            </div>
          </Link>

          {/* Fern Pattern Card */}
          <Link 
            href="/fern"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-green-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Fern Fractals
                </h2>
                <p className="text-gray-600 mb-6">
                  Create the famous Barnsley Fern using mathematical transformations. 
                  Watch how four simple rules create realistic fern patterns.
                </p>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium group-hover:bg-green-200 transition-colors">
                  Create Fern Pattern →
                </div>
              </div>
            </div>
          </Link>

          {/* Coral Pattern Card */}
          <Link 
            href="/coral"
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-cyan-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🪸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Staghorn Coral
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore the antler-like branching patterns of staghorn coral. 
                  Discover how these marine builders use fractal growth for efficient feeding.
                </p>
                <div className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg font-medium group-hover:bg-cyan-200 transition-colors">
                  Create Coral Pattern →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Educational Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              What are Fractals?
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Fractals are patterns that repeat at every scale. They&apos;re everywhere in nature - 
              from the branching of trees to the structure of snowflakes, from coastlines to clouds. 
              These patterns follow simple mathematical rules that create incredibly complex and beautiful results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}