"use client"

import { useState } from "react"
import { CreditCard, Lock, Moon, User } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="flex-1 p-4 md:p-6 bg-black">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-6">
            <User className="h-5 w-5 mr-2" />
            <h3 className="text-xl font-bold">Account Settings</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Name</h4>
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-black border border-gray-700 focus:border-primary focus:outline-none"
                defaultValue="John Doe"
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Email</h4>
              <input
                type="email"
                className="w-full p-2 rounded-lg bg-black border border-gray-700 focus:border-primary focus:outline-none"
                defaultValue="john.doe@example.com"
              />
            </div>

            <button className="px-4 py-2 bg-primary text-black rounded-lg font-medium">Save Changes</button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-6">
            <Lock className="h-5 w-5 mr-2" />
            <h3 className="text-xl font-bold">Security</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Change Password</h4>
              <input
                type="password"
                className="w-full p-2 rounded-lg bg-black border border-gray-700 focus:border-primary focus:outline-none mb-2"
                placeholder="Current Password"
              />
              <input
                type="password"
                className="w-full p-2 rounded-lg bg-black border border-gray-700 focus:border-primary focus:outline-none mb-2"
                placeholder="New Password"
              />
              <input
                type="password"
                className="w-full p-2 rounded-lg bg-black border border-gray-700 focus:border-primary focus:outline-none"
                placeholder="Confirm New Password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>

            <button className="px-4 py-2 bg-primary text-black rounded-lg font-medium">Update Security</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-6">
            <Moon className="h-5 w-5 mr-2" />
            <h3 className="text-xl font-bold">Preferences</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-400">Enable dark theme</p>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-gray-400">Enable push notifications</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 rounded-3xl bg-card">
          <div className="flex items-center mb-6">
            <CreditCard className="h-5 w-5 mr-2" />
            <h3 className="text-xl font-bold">Payment Methods</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black flex justify-between items-center">
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-gray-400">Expires 12/25</div>
              </div>
              <button className="text-sm text-primary">Edit</button>
            </div>

            <div className="p-4 rounded-xl bg-black flex justify-between items-center">
              <div>
                <div className="font-medium">Mastercard ending in 8888</div>
                <div className="text-sm text-gray-400">Expires 10/24</div>
              </div>
              <button className="text-sm text-primary">Edit</button>
            </div>

            <button className="w-full p-3 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-primary transition-colors">
              + Add New Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
