/**
 * Utility to export tabular data to a downloadable CSV file.
 * 
 * @param {Array} data - Array of objects containing the rows to export
 * @param {Array} columns - Table column configurations (header, accessor, exportValue)
 * @param {string} filename - Output file name
 */
export const exportToCSV = (data, columns, filename = "export.csv") => {
  if (!data || !data.length) return;

  const headers = columns.map(col => col.header || "");
  const csvRows = [];

  // Add header row
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));

  // Add data rows
  data.forEach(row => {
    const values = columns.map(col => {
      let val = "";
      if (col.exportValue) {
        val = col.exportValue(row);
      } else if (col.accessor) {
        const rawVal = row[col.accessor];
        val = rawVal !== undefined && rawVal !== null ? rawVal : "";
      }
      let stringVal = String(val);
      // Force Excel/Sheets to treat phone numbers as text by prepending a tab
      // This prevents long numbers or numbers starting with + from being converted to scientific notation
      if (/^\+?\d{10,15}$/.test(stringVal.replace(/\s+/g, ''))) {
        stringVal = `\t${stringVal}`;
      }
      return `"${stringVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  });

  // Generate blob & download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
