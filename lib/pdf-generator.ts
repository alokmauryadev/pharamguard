import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generatePDF(elementId: string, filename: string = "report.pdf") {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Allow loading cross-origin images if any
            logging: false,
            backgroundColor: "#ffffff", // Ensure white background
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multi-page PDFs if report is long
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
    } catch (error) {
        console.error("PDF Generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}
