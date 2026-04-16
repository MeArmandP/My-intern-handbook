export default function ExportButton({ adviceList }) {
  const exportMarkdown = () => {
    let md = '# 📖 My Intern Advice Book\n\n';
    md += `*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    const grouped = {};
    for (const a of adviceList) {
      const cat = a.category || 'general';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(a);
    }

    for (const [category, items] of Object.entries(grouped)) {
      md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      for (const a of items) {
        md += `> "${a.text}"\n>\n`;
        md += `> — **${a.advisor_name}**`;
        if (a.advisor_role) md += `, ${a.advisor_role}`;
        md += '\n\n';
        if (a.context_notes) md += `*Context: ${a.context_notes}*\n\n`;
        if (a.tags && a.tags.length) md += `Tags: ${a.tags.map(t => `\`${t}\``).join(', ')}\n\n`;
        md += '---\n\n';
      }
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intern-advice-book.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn-secondary" onClick={exportMarkdown} title="Export as Markdown">
      📥 Export Markdown
    </button>
  );
}
