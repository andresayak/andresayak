// file: generate-pdf.ts
import * as fs from 'fs';
import * as path from 'path';
import html_to_pdf from 'html-pdf-node';

async function generatePdf() {
    const htmlPath = path.join(process.cwd(), 'index.html');
    const cssPath = path.join(process.cwd(), 'pdf.css');
    const outputPath = path.join(process.cwd(), 'output.pdf');

    if (!fs.existsSync(htmlPath)) {
        throw new Error(`❌ Файл index.html не знайдено: ${htmlPath}`);
    }

    // Зчитуємо HTML
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Якщо є styles.css — вставляємо його inline
    if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        htmlContent = htmlContent.replace(
            /<link[^>]*href=["'][^\.]+\.css["'][^>]*>/i,
            `<style>${cssContent}</style>`
        );
        console.log('✅ CSS вставлено у HTML');
    } else {
        console.warn('⚠️  Файл styles.css не знайдено — PDF буде без стилів');
    }

    // Генерація PDF
    const file = {content: htmlContent};
    const options = {
        format: 'A4',
        printBackground: true,
    };

    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ PDF створено: ${outputPath}`);
}

generatePdf().catch((err) => console.error('❌ Помилка:', err));
