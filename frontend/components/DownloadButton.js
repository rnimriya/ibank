"use client";

import { Download } from "lucide-react";
import toast from "react-hot-toast";

export default function DownloadButton({ conversion, className }) {
  const handleDownload = () => {
    toast.success(`Downloading ${conversion.fileName}...`);
    
    // Simulate a CSV download
    const csvContent = "data:text/csv;charset=utf-8,Date,Description,Debit,Credit,Balance\n2023-10-01,Zomato,500.0,0.0,45000.0\n2023-10-02,Salary NEFT,0.0,50000.0,95000.0\n2023-10-03,Amazon AWS,1500.0,0.0,93500.0";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", conversion.fileName.replace(".pdf", ".csv"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className={className} title="Download">
      <Download size={18} />
    </button>
  );
}
