const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    // 1x1 transparent PNG pixel base64
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'yezbee/test',
    });
    console.log("Upload Success:", result.secure_url);
  } catch (error) {
    console.error("Upload Error:", error);
  }
}

testUpload();
