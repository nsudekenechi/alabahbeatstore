const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require("fs");
const path = require('path');
async function generateLicensePDFBuffer(beatPurchases, buyerName, buyerEmail, purchaseDate) { 
  try{
      const signaturePath = path.join(__dirname, '../assets/signature.png'); // adjust path as needed
      const pdfDoc = await PDFDocument.create();
  const signatureImageBytes = fs.readFileSync(signaturePath);
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes); // use embedJpg if JPG
  const sigDims = signatureImage.scale(0.3);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const lineHeight = 20;
  let y = pageHeight - margin;

  // Helper to create a page and set the initial state
  const pages = [];
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  pages.push(currentPage);

  const drawText = (text, size = 12) => {
    if (y < margin + lineHeight) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pages.push(currentPage);
      y = pageHeight - margin;
    }
    currentPage.drawText(text, {
      x: margin,
      y,
      size,
      font: /\b\d+\./.test(text) || text == "License Agreement" ? boldFont : font, //adding bold font to text with numbers 
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };
  const drawHorizontalLine = () => {
    if (y < margin + 10) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    currentPage.drawRectangle({
      x: margin,
      y: y - 5,
      width: pageWidth - 2 * margin,
      height: 1, // thin line
      color: rgb(0.5, 0.5, 0.5),
    });
    y -= lineHeight;
  };

  // === Begin Writing Content ===
  drawText("Beat License Agreement", 18);
  drawHorizontalLine()
  y -= 10;
  drawText("License Agreement", 11);

  y -= 10;
  drawText("This agreement is made between Alabah Beat Store (“Licensor”) and:");
  drawText(`Licensee (Buyer): ${buyerName}`);
  drawText(`Email: ${buyerEmail}`);
  drawText(`Date of Purchase: ${purchaseDate}`);
  drawHorizontalLine()
  y -= lineHeight;

  drawText("1. Beat Information", 14);
  beatPurchases.forEach((beat, index) => {
    const capitalizeBeatTitle = beat.title[0].toUpperCase().concat(beat.title.slice(1))
    const capitalizelicenseType = beat.licenseType[0].toUpperCase().concat(beat.licenseType.slice(1))
    drawText(`•  ${capitalizeBeatTitle} - ${capitalizelicenseType} Lease`);
    if (beat.limit) drawText(`Distribution Limit: ${beat.limit} copies`, 14);
  });

  drawText("•  Producer: Alabah");
  drawHorizontalLine()
  y -= lineHeight * 2;

  drawText("2. Grant of Rights", 14);
  drawText("•  The Licensor grants the Licensee a non-exclusive / exclusive (depending on license)");
  drawText("license to use the beat under the terms below:");
  y -= 10;
  drawText("•  The Licensee may use the beat for recording, distribution, performance,");
  drawText("promotion, and monetization.");
  y -= 10;
  drawText("•  This license does not transfer ownership of the beat.");
  y -= 10;
  drawText("•  The Licensee may distribute up to the stated limit (if applicable).");
  y -= 10;
  drawHorizontalLine()
  y -= lineHeight;
  drawText("3. Restrictions", 14);
  drawText("Licensee may not resell, sublicense, or transfer the beat to any third party.");
  drawText("Unauthorized use beyond the agreed license may result in legal action.");
  drawHorizontalLine()
  y -= lineHeight;
  drawText("4. Credit", 14);
  drawText("Licensee agrees to credit the producer in all public uses:");
  drawText("Produced by Alabah");
  drawHorizontalLine()
  y -= lineHeight;
  drawText("5. Termination", 14);
  drawText("This license is valid indefinitely unless terminated due to breach of terms.");
  drawHorizontalLine()
  y -= lineHeight;
  drawText("6. Agreement", 14);
  drawText("By purchasing and downloading the beat, the Licensee agrees to all terms outlined in this license.");

  y -= lineHeight;
  drawText("Signature (Producer):  ____________________________");
  // Draw the image to the right of the label
  currentPage.drawImage(signatureImage, {
    x: margin + 150,  // adjust x-position to sit next to the text
    y: y - (lineHeight - 20),          // align vertically with the text
    width: 200,
    height: 60,
  });

  // y -= sigDims.height + 10;
  drawText("Signature (Buyer): ____________________________");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
  }catch(err){
    console.log(err);
  }

}


module.exports = generateLicensePDFBuffer