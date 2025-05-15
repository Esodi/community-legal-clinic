"use client"

export default function WalletsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wallets</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Main Wallet</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$45,250.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Available balance</p>
          <div className="mt-4 space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Deposit
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Withdraw
            </button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Investment Wallet</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$75,000.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Invested amount</p>
          <div className="mt-4 space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Returns Wallet</h2>
          <p className="text-3xl font-bold text-green-600">$12,500.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total returns</p>
          <div className="mt-4 space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Withdraw Returns
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <div>
              <p className="font-medium">Deposit to Main Wallet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mar 15, 2024</p>
            </div>
            <p className="text-green-600 font-medium">+$5,000.00</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <div>
              <p className="font-medium">Investment Transfer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mar 14, 2024</p>
            </div>
            <p className="text-blue-600 font-medium">-$10,000.00</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <div>
              <p className="font-medium">Returns Received</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mar 13, 2024</p>
            </div>
            <p className="text-green-600 font-medium">+$750.00</p>
          </div>
        </div>
      </div>
    </div>
  )
} 