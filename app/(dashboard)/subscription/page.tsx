"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    price: "9.99",
    description: "Perfect for getting started",
    features: [
      "Basic workflow tools",
      "Up to 5 projects",
      "2 team members",
      "Basic support",
      "1GB storage",
    ],
    notIncluded: [
      "Advanced workflow features",
      "Custom branding",
      "API access",
      "Priority support",
    ]
  },
  {
    name: "Pro",
    price: "29.99",
    description: "Best for growing businesses",
    popular: true,
    features: [
      "Advanced workflow features",
      "Up to 15 projects",
      "5 team members",
      "Priority support",
      "10GB storage",
      "Custom branding",
      "API access",
      "Portfolio management",
    ],
    notIncluded: [
      "Unlimited projects",
      "24/7 phone support",
      "Investment features",
    ]
  },
  {
    name: "Enterprise",
    price: "99.99",
    description: "For large scale organizations",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "24/7 phone support",
      "Unlimited storage",
      "Custom branding",
      "API access",
      "Advanced portfolio management",
      "Investment features",
      "Custom integrations",
      "Dedicated account manager",
    ],
    notIncluded: []
  }
]

const billingOptions = ["Monthly", "Annual"]

export default function SubscriptionPage() {
  const [selectedBilling, setSelectedBilling] = useState("Monthly")

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-[#1F1F23] rounded-lg p-1">
            {billingOptions.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedBilling === option
                    ? "bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setSelectedBilling(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Save 20% with annual billing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-[#1F1F23] rounded-xl shadow-lg overflow-hidden ${
                plan.popular ? "ring-2 ring-[#D4A537]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#D4A537] text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${selectedBilling === "Annual" 
                      ? (Number(plan.price) * 0.8).toFixed(2)
                      : plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    /{selectedBilling.toLowerCase().slice(0, -2)}
                  </span>
                </div>
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular
                      ? "bg-[#D4A537] hover:bg-[#C29432]"
                      : "bg-gray-900 dark:bg-[#2D2D33] hover:bg-gray-800 dark:hover:bg-[#3D3D43]"
                  }`}
                >
                  Get started
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center text-sm">
                      <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All plans include: 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
} 