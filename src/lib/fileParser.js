/**
 * Reads and parses uploaded file (.txt, .md, .json) into rich HTML/text for TipTap editor.
 */
export async function parseUploadedFile(file) {
  if (!file) throw new Error("No file provided");

  const fileName = file.name;
  const ext = fileName.split('.').pop().toLowerCase();

  // Read file reliably using FileReader API
  const text = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result || '');
    reader.onerror = () => reject(new Error("Could not read file contents"));
    reader.readAsText(file);
  });

  if (ext === 'md') {
    // Simple Markdown to HTML formatting conversion
    const html = text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$2</h2>')
      .replace(/^### (.*$)/gim, '<h3>$3</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n$/gim, '<br />')
      .replace(/\n/gim, '<p></p>');
    return { title: fileName.replace(/\.[^/.]+$/, ""), content: html };
  }

  if (ext === 'txt') {
    const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
    return { title: fileName.replace(/\.[^/.]+$/, ""), content: html };
  }

  if (ext === 'json') {
    try {
      const parsed = JSON.parse(text);
      return {
        title: parsed.title || fileName.replace(/\.[^/.]+$/, ""),
        content: parsed.content || `<p>${text}</p>`
      };
    } catch (e) {
      return { title: fileName, content: `<p>${text}</p>` };
    }
  }

  throw new Error(`Unsupported file type: .${ext}. Please upload .txt, .md, or .json files.`);
}