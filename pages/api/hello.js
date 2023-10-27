// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PdfReader } from "pdfreader";
import { writeFileSync } from "node:fs";

export default async function handler(req, res) {
  const file = req.body.txt;
  console.dir(req.body);
  // const buf = await file.arrayBuffer();
  // file.lastModifiedDate = new Date();
  // file.name = fileName;
  writeFileSync("pdf.pdf", file);

  new PdfReader().parseFileItems("pdf.pdf", (err, item) => {
    if (err) console.error("error:", err);
    else if (!item) console.warn("end of buffer");
    else if (item.text) console.log(item.text);
  });
  res.status(200).json({ name: "John Doe" });
}
