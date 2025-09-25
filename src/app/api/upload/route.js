

import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import multer from '@/lib/multer'
import { Readable } from 'stream'


export const config = {
  api: {
    bodyParser: false,
  },
}


function bufferToStream(buffer) {
  return new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    },
  })
}

export async function POST(req) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, {}, async (err) => {
      if (err) {
        console.error('Multer error:', err)
        return resolve(
          NextResponse.json({ success: false, error: 'Image upload failed' }, { status: 500 })
        )
      }

      const file = req.file
      if (!file) {
        return resolve(
          NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
        )
      }

      try {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'cityfix_issues',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error)
              return resolve(
                NextResponse.json({ success: false, error: 'Upload to Cloudinary failed' }, { status: 500 })
              )
            }
            return resolve(
              NextResponse.json({ success: true, imageUrl: result.secure_url }, { status: 200 })
            )
          }
        )

        bufferToStream(file.buffer).pipe(stream)
      } catch (error) {
        console.error('Upload failed:', error)
        return resolve(
          NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 })
        )
      }
    })
  })
}
