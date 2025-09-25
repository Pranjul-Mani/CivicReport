
# CivicReport

CivicReport is a full-stack web application that empowers citizens to report, track, and resolve civic issues (like potholes, broken streetlights, sanitation problems, etc.).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Getting Started](#getting-started)



## Features

- **Report Issues** – Submit civic problems with descriptions, categories, location, and images.

- **Image Uploads** – Upload issue photos securely via Cloudinary.

- **Authentication** – Secure login/signup using NextAuth

- **Issue Tracking** – View issues by status: Open, In Progress, or Resolved.

- **Modern UI** – Built with Next.js 15, Tailwind CSS, and Shadcn/UI for a responsive, clean experience.



## Tech Stack

### Frontend
- **Next.js 15** : Full-stack React framework.

- **Tailwind CSS** : Utility-first styling.

- **Shadcn UI** : Prebuilt UI components.

### Backend

- **Node.js** : Backend runtime.

- **MongoDB** : NoSQL database.

### File Storage: 

- **Cloudinary** : Image storage and management.
## Getting Started
### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/civicreport.git
cd civicreport

```
### 2. Setup 
```bash
npm install

```

####  Configure Environment Variables
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


```
