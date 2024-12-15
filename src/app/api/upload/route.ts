// pages/api/upload.ts
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const POST = async (req: Request) => {
  try {
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public/assets/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      console.error("No files received");
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const filePaths = [];

    for (const file of files) {
      // Log file details for debugging
      console.log("Received file:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Generate unique filename
      const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
      const sanitizedFilename = uniqueFilename.replaceAll(" ", "_");

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadPath = path.join(uploadDir, sanitizedFilename);

      // Log upload path for debugging
      console.log("Upload path:", uploadPath);

      await writeFile(uploadPath, buffer);

      filePaths.push(`/assets/${sanitizedFilename}`);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      filePaths,
      status: 201
    });
  } catch (error) {
    // Comprehensive error logging
    console.error("Complete error object:", error);
    console.error("Error name:", error instanceof Error ? error.name : "Unknown error type");
    console.error("Error message:", error instanceof Error ? error.message : "No error message");

    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json({
      message: "File upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500
    }, { status: 500 });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
