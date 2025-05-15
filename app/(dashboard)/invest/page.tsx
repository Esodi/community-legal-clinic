"use client"

export default function InvestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Investment Opportunities</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Real Estate Fund</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$250,000</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Target raise</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">75% funded</p>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Invest Now
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Tech Startup</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$100,000</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Target raise</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">45% funded</p>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Invest Now
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Small Business Loan</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$50,000</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Target raise</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "90%" }}></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">90% funded</p>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Invest Now
          </button>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Investment Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Minimum Investment</p>
              <p className="font-medium">$1,000</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Investment Period</p>
              <p className="font-medium">12-36 months</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Expected Returns</p>
              <p className="font-medium">8-15% annually</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Risk Level</p>
              <p className="font-medium">Moderate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 