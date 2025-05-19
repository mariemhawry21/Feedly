const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgBB(filePath) {
  try {
    const form = new FormData();
    form.append("key", process.env.IMGBB_API_KEY);
    form.append("image", fs.createReadStream(filePath));

    const res = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    return res.data.data.url;
  } catch (error) {
    console.error("ImgBB upload error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = uploadToImgBB;
