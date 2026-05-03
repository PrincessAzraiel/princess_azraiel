export async function generatePDF(
  element: HTMLElement,
  opts?: { filename?: string }
) {
  const filename = opts?.filename ?? "contract.pdf";

  // Clone so we can replace inputs with printable spans
  const clone = element.cloneNode(true) as HTMLElement;

  // Replace form controls with their values so the PDF shows filled fields
  clone.querySelectorAll("input, textarea, select").forEach((node) => {
    const el = node as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const span = document.createElement("span");
    const value =
      (el as any).value ??
      el.getAttribute("value") ??
      (el instanceof HTMLSelectElement
        ? el.selectedOptions?.[0]?.textContent ?? ""
        : "");

    span.textContent = value || "";
    span.className =
      "mx-1 inline-block text-pink-300 border-b border-pink-500/40 px-1";
    node.replaceWith(span);
  });

  // Open a real window (don’t use noreferrer/noopener here or some browsers block doc.write)
  const w = window.open("", "_blank", "width=980,height=1100");
  if (!w) return;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${filename}</title>

  <!-- Tailwind CDN so your existing className styling works in the print window -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Your fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Syncopate:wght@400;700&display=swap" rel="stylesheet">

  <style>
    .font-italiana { font-family: 'Italiana', serif; }
    .font-manrope { font-family: 'Manrope', sans-serif; }
    .font-syncopate { font-family: 'Syncopate', sans-serif; }

    body{
      margin:0;
      background:#050505;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page { size: A4; margin: 12mm; }

    /* Optional: make the exported result a bit tighter/cleaner */
    @media print {
      /* If you want scanlines/noise in the PDF, keep them. If not, remove them in your exporting mode before calling generatePDF. */
    }
  </style>
</head>
<body>
  <div class="min-h-screen w-full bg-[#050505] text-pink-50">
    <div class="mx-auto w-full max-w-3xl px-6 py-10">
      ${clone.outerHTML}
    </div>
  </div>

  <script>
    document.title = ${JSON.stringify(filename)};

    // Wait a moment for Tailwind + fonts, then open print dialog
    (async () => {
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
      } catch(e) {}
      setTimeout(() => {
        window.focus();
        window.print();
      }, 600);
    })();

    window.addEventListener('afterprint', () => setTimeout(() => window.close(), 50));
  </script>
</body>
</html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}
