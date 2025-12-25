import { generatePDF } from "@/app/contract/utils/generatePDF";

export function ExportPDF() {
  return (
    <button
      onClick={() =>
        generatePDF(document.getElementById("contract-root")!)
      }
      className="
        mt-8 px-6 py-3 bg-pink-600 text-black
        hover:bg-pink-500 transition
      "
    >
      Export as PDF
    </button>
  );
}
