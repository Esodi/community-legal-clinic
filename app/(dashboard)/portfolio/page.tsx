"use client"

export default function PortfolioPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Investment</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$75,000.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Across all portfolios</p>
        </div>
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Value</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$82,500.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">+10% total return</p>
        </div>
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Investments</h2>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">In progress</p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Investment Distribution</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Real Estate</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">45%</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Startups</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">30%</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Small Business</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">25%</p>
          </div>
        </div>
      </div>
    </div>
  )
} 