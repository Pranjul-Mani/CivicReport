"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar({ showBackButton = false, onBackClick = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path) => pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left Logo + Back button */}
          <div className="flex items-center space-x-3">
            {showBackButton && onBackClick && (
              <Button variant="ghost" size="sm" onClick={onBackClick}>
                ← Back
              </Button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                CivicReport
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/issues" 
              className={`transition-colors ${
                isActive('/issues') 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Browse Issues
            </Link>
           
            <Link 
              href="/dashboard" 
              className={`transition-colors ${
                isActive('/dashboard') 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>

        

            {/* Sign In / Sign Out Button */}
            {session ? (
              <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button className="cursor-pointer" variant="default" size="sm" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/issues" 
                className={`transition-colors ${
                  isActive('/issues') 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Issues
              </Link>
              
              <Link 
                href="/dashboard" 
                className={`transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-2 flex justify-between items-center">
                
                {session ? (
                  <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                ) : (
                  <Button className="cursor-pointer" variant="default" size="sm" onClick={() => signIn()}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
