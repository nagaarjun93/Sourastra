const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\NAGA ARJUN\\.gemini\\antigravity\\brain\\88a9b925-e75f-494c-a7b2-8424fcd129de\\.user_uploaded\\media_1790649840599.pdf';

async function extract() {
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buf });
  await parser.load();
  const info = await parser.getInfo();
  console.log('PDF Info:', info);
  
  const textResult = await parser.getText();
  console.log('Text result length:', textResult.length || (typeof textResult === 'string' ? textResult.length : JSON.stringify(textResult).length));
  
  const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));
  fs.writeFileSync(path.join(__dirname, 'pdf_extracted_full.txt'), text, 'utf8');
  console.log('Saved to pdf_extracted_full.txt');
  console.log('\n--- First 500 chars ---');
  console.log(text.slice(0, 500));
}

extract().catch(console.error);
