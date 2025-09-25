import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/user"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()
    await dbConnect()


    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

   
    const hashed = await bcrypt.hash(password, 10)

   
    await User.create({ name, email, password: hashed })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 })
  }
}
