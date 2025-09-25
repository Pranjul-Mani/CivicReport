import dbConnect from "@/lib/dbConnect";
import Issue from "@/models/issue";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET(req, { params }) {
  try {
    const { Id } = await params;

    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const issue = await Issue.findById(Id).lean();
    if (!issue) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(issue, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch issue" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { Id } = await params;
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

   
    const formData = await req.formData();
    
    await dbConnect();

    const issue = await Issue.findById(Id);
    if (!issue) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (issue.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    
    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location");
    const category = formData.get("category");
    const status = formData.get("status");

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (location) issue.location = location;
    if (category) issue.category = category;
    if (status) issue.status = status;

   
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      
      if (issue.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(issue.image.public_id);
        } catch (e) {
          console.error("Failed to delete old image:", e);
        }
      }

     
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cityfix_issues" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      issue.image = { url: result.secure_url, public_id: result.public_id };
    }

    const saved = await issue.save();
    return Response.json(saved, { status: 200 });
  } catch (err) {
    console.error("PUT /api/issues/[Id] error:", err);
    return Response.json({ 
      error: "Failed to update issue", 
      details: err.message 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { Id } = await params;
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const issue = await Issue.findById(Id);
    if (!issue) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (issue.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    
    if (issue.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(issue.image.public_id);
      } catch (e) {
        console.error("Failed to delete image:", e);
      }
    }

    await Issue.findByIdAndDelete(Id);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/issues/[Id] error:", err);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}