"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, ArrowRight, Play, Plus, Camera, TrendingUp, ThumbsUp, Shield, Smartphone, Star } from "lucide-react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import IssueForm from "./IssueForm" 

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const { data: session, status } = useSession()

 
  const handleIssueSubmit = (issueData) => {
    console.log('Issue submitted:', issueData)
    
    setIsReportDialogOpen(false)
   
    alert("Issue reported successfully!")
  }

  
  const handleFormCancel = () => {
    setIsReportDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
     
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-28 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">🚀 Making Cities Better Together</Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Report Issues,{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Track Progress
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empower your community by reporting civic issues like potholes, broken streetlights, and more. Track
                  resolution progress and make your voice heard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/issues">
                  <Button
                    size="lg"
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6"
                  >
                    Start Reporting
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
               
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-xl">
                <img
                  src="/h2.png?height=600&width=700"
                  alt="CivicReport App Interface"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl aspect-[4/3]"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need to Make a Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to report, track, and resolve civic issues in your community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Photo & Location</CardTitle>
                <CardDescription>
                  Capture issues with photos and automatic GPS location tagging for precise reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  View all reported issues on an interactive map and see what's happening in your area.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Track the status of reported issues from submission to resolution with real-time updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Community Voting</CardTitle>
                <CardDescription>
                  Vote on issues to help prioritize what gets fixed first in your community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Municipality Dashboard</CardTitle>
                <CardDescription>
                  Direct integration with city officials for faster response and transparent communication.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Optimized for mobile devices so you can report issues on-the-go, anywhere, anytime.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple Steps to Make a Difference</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold">Spot an Issue</h3>
              <p className="text-gray-600">
                Notice a pothole, broken streetlight, or other civic issue in your community.
              </p>
              <img src="/first.jpg" alt="Spotting an issue" className="rounded-lg mx-auto" />
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold">Report & Photo</h3>
              <p className="text-gray-600">Take a photo, add location details, and submit your report in seconds.</p>
              <img
                src="/second.jpg"
                alt="Reporting an issue"
                className="rounded-lg mx-auto"
              />
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-gray-600">Follow the resolution process and get notified when the issue is fixed.</p>
              <img src="/third.jpg" alt="Tracking progress" className="rounded-lg mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Community Says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>W</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Wanda</div>
                    <div className="text-sm text-gray-600">Local Resident</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Finally, a way to report issues that actually gets results! The pothole on my street was fixed within
                  a week of reporting it."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>TS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Stark</div>
                    <div className="text-sm text-gray-600">Community Leader</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "The transparency is amazing. I can see exactly what's being worked on and when issues will be
                  resolved."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Thor</div>
                    <div className="text-sm text-gray-600">City Council Member</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "This platform has revolutionized how we handle civic issues. We can prioritize based on community
                  needs."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make Your Community Better?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens already making a difference in their communities.
          </p>
          <Link href="/issues">
            <Button
              size="lg"
              className="cursor-pointer bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Start Reporting Issues
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

     {/* Footer */}
<footer className="bg-gray-900 text-white py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center text-gray-400 flex items-center justify-center space-x-6">
      <p>&copy; 2025 CivicReport. All rights reserved.</p>
      <span>|</span>
      <span>Pranjul Mani</span>
      <span>|</span>
      <a href="https://github.com/Pranjul-Mani" className="hover:text-white transition-colors">
        GitHub
      </a>
      <span>|</span>
      <a href="https://www.linkedin.com/in/pranjul-mani/" className="hover:text-white transition-colors">
        LinkedIn
      </a>
    </div>
  </div>
</footer>

      <Button
        onClick={() => {
          if (status === "unauthenticated") {
            signIn() 
          } else {
            setIsReportDialogOpen(true) 
          }
        }}
        className="cursor-pointer fixed bottom-6 right-6 rounded-full w-20 h-20 shadow-2xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-110 transition-all duration-200"
        size="lg"
      >
        <Plus className="w-16 h-16" />
      </Button>

      {isReportDialogOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <IssueForm 
              onSubmit={handleIssueSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}