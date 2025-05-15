"use client"

import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Terms & Policies</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Terms of Service</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By accessing and using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">2. Use License</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permission is granted to temporarily access the materials (information or software) on our platform for personal, non-commercial transitory viewing only.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">3. User Responsibilities</h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 space-y-1">
                <li>Maintain the confidentiality of your account</li>
                <li>Provide accurate and complete information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights of other users</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy Policy</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">1. Information Collection</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 mt-2 space-y-1">
                <li>Account registration information</li>
                <li>Profile information</li>
                <li>Usage data and analytics</li>
                <li>Communication preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">2. Data Protection</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 mt-2 space-y-1">
                <li>Encryption of personal data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">3. Your Rights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You have the right to:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you have any questions about these Terms & Policies, please contact us at:
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Email: support@example.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 