"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How do I start investing?",
    answer:
      "To start investing, first complete your profile and verify your identity. Then, browse available investment opportunities in the Invest section. Choose an investment that matches your goals and risk tolerance, and follow the steps to make your first investment.",
  },
  {
    question: "What are the minimum investment amounts?",
    answer:
      "Minimum investment amounts vary by opportunity. Generally, they start at $1,000 for most investments. Some premium opportunities may have higher minimums. Check each investment's details for specific requirements.",
  },
  {
    question: "How can I track my investments?",
    answer:
      "You can track all your investments in the Portfolio section. Here you'll find detailed information about each investment, including current value, returns, and important updates. The Dashboard also provides a quick overview of your investment performance.",
  },
  {
    question: "What are the fees involved?",
    answer:
      "Our fee structure is transparent and varies by investment type. Generally, we charge a 1-2% management fee on invested capital. There may be additional fees for specific services or premium investments. All fees are clearly disclosed before you make an investment.",
  },
  {
    question: "How do I withdraw my investments?",
    answer:
      "Withdrawal processes vary by investment type. Some investments have lock-up periods, while others may be more liquid. To initiate a withdrawal, go to your Portfolio, select the investment, and click the Withdraw button. Follow the prompts to complete the process.",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFAQs, setOpenFAQs] = useState<number[]>([])

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Help Center</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">How can we help you?</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-[#2D2D33] dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  {openFAQs.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQs.includes(index) && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Still Need Help?</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Contact Support
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#2D2D33]">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 