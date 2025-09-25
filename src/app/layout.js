import "./globals.css"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"

export const metadata = {
  title: "CivicReport",
  description: "Report and track civic issues in your community",
  icons: {
    icon: '/city.png', 
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
