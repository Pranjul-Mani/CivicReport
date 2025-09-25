
import dbConnect from "@/lib/dbConnect";
import Issue from "@/models/issue";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET() {
  try {
    await dbConnect();
    const issues = await Issue.find().sort({ createdAt: -1 }).lean();
    return Response.json(issues, { status: 200 });
  } catch (err) {
    console.error("GET /api/issues error:", err);
    return Response.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") || "";
    const description = formData.get("description") || "";
    const category = formData.get("category") || "General";
    const location = formData.get("location") || "";
    // const priority = formData.get("priority") || "low";

    let imageObj = { url: "", public_id: "" };

    const file = formData.get("image"); 
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cityfix_issues" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageObj = { url: result.secure_url, public_id: result.public_id };
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      // priority,
      image: imageObj,
      createdBy: session.user.id,
    });

    return Response.json(newIssue, { status: 201 });
  } catch (err) {
    console.error("POST /api/issues error:", err);
    return Response.json(
      { error: "Failed to create issue", details: String(err) },
      { status: 500 }
    );
  }
}
