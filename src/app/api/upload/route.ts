import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Configure formidable to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadedFile {
  name: string;
  url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Specify the folder to store uploaded files
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Use promise-based parsing
  try {
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true,
    });

    const [ , files] = await form.parse(req);

    // Type-safe handling of files
    const uploadedFiles: UploadedFile[] = Object.values(files)
      .filter((fileArray): fileArray is formidable.File[] => Array.isArray(fileArray))
      .flatMap((fileArray: formidable.File[]) => 
        fileArray.map((file: formidable.File) => ({
          name: file.originalFilename || 'unknown',
          url: `/uploads/${file.newFilename}`,
        }))
      );

    // Send back the uploaded files' information
    res.status(200).json({ files: uploadedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during the file upload.' });
  }
};

export default handler;