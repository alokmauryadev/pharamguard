import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generatePDF(elementId: string, filename: string = "report.pdf") {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // Create a clone of the element to avoid modifying the original DOM during capture
        // overload the clone with specific styles for PDF generation
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.width = "1200px"; // Set a fixed width for consistent PDF layout
        clone.style.padding = "40px";
        clone.style.background = "#ffffff";

        // Append clone to body but hide it from view (off-screen)
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        document.body.appendChild(clone);

        // Wait for images to load in the clone if necessary (simple delay for now)
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(clone, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Allow loading cross-origin images
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 1200, // Match clone width
        });

        // Clean up
        document.body.removeChild(clone);

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
