 const handleDownload = async (uri : string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob); 
    const link = document.createElement("a");
    link.href = url;
    link.download = "Invoice.pdf"; // your file name
    link.click();
    window.URL.revokeObjectURL(url);
  };

  export default handleDownload;