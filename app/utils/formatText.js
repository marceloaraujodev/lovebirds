export default function formatText(text) {
  // Replace all instances of "\n\n" with new line
  const paragraphs = text.replace(/\\n/g, '\n');

  return paragraphs
};