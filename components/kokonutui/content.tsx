import List02 from "./list-02"
import { CheckCircle2, ArrowRight, Plus, ChevronLeft, ChevronRight } from "lucide-react"

export default function Content() {
  return (
    <div className="space-y-4">
      {/* CSCS Active Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-950 dark:to-purple-950 text-white p-6 rounded-xl flex items-center justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">CSCS Active</h3>
            <p className="text-sm text-white/80">Your CSCS and CHN is now active, you can begin trading.</p>
          </div>
        </div>
        <button className="bg-white hover:bg-white/90 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95">
          Trade now
        </button>
      </div>

      {/* Portfolio and Wallet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
          <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Portfolio Value</h2>
          <div className="text-2xl font-bold mb-4">****</div>
          <button className="text-sm text-gray-900 dark:text-white flex items-center gap-2 transition-all duration-200 hover:gap-3">
            View portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
          <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wallet Value</h2>
          <div className="text-2xl font-bold mb-4">****</div>
          <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md active:scale-95">
            <Plus className="w-4 h-4" />
            Fund wallet
          </button>
        </div>
      </div>

      {/* Biggest Daily Movers */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Biggest daily movers</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stocks that have gained or lost the most in the last 24 hours
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <List02 />
      </div>
    </div>
  )
}
