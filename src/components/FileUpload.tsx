import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { saveAs } from "file-saver";

interface RowData {
  Pax?: any;
  From?: any;
  Comment?: any;
  Date: string;
  "Guest Name": string;
  Transfer: string;
  "Car Type": string;
  Hotel: string;
  "Flight No.": string;
  "Arr. T": string;
  "DEP.T": string;
  REF: string;
  Driver: string;
  [key: string]: any;
}

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RowData[]>([]);
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const tableHeaders = [
    // "M".trim(),
    "Date".trim(),
    "Guest Name".trim(),
    "Transfer".trim(),
    "Car Type".trim(),
    "Pax".trim(),
    "Hotel".trim(),
    "Flight No.".trim(),
    "From".trim(),
    "Arr.T".trim(),
    "DEP.T".trim(),
    "REF".trim(),
    // "Comment".trim(),
    "Driver".trim(),
  ];

  const updateCounter = (data: RowData[], startFrom = 0) => {
    return data.map((row, index) => ({ ...row, M: startFrom + index }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split(".").pop()?.toLowerCase();
      if (fileType === "xlsx" || fileType === "xls") {
        setFile(uploadedFile);
        setError(null);
        setSnackbar({
          open: true,
          message: "File uploaded successfully!",
          type: "success",
        });
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls).");
        setFile(null);
        setSnackbar({
          open: true,
          message: "Invalid file format!",
          type: "error",
        });
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setError(null);
  };

  const handleReadFile = () => {
    if (!file) {
      setError("Please upload an Excel file.");
      setSnackbar({
        open: true,
        message: "Please upload an Excel file first!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: RowData[] = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
      });

      setData(jsonData);
      setFilteredData(jsonData);
      setError(null);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Data read successfully!",
        type: "success",
      });
    };

    reader.onerror = (err) => {
      setLoading(false);
      setError("Error reading the Excel file.");
      setSnackbar({
        open: true,
        message: "Error reading the Excel file.",
        type: "error",
      });
      console.error(err);
    };

    reader.readAsBinaryString(file);
  };

  const handleFilterByDate = () => {
    if (!selectedDate) {
      setError("Please select a date.");
      setSnackbar({
        open: true,
        message: "Please select a date first!",
        type: "error",
      });
      return;
    }

    const formattedSelectedDate = formatDate(selectedDate);

    const filtered = data.filter((row) => {
      const formattedRowDate = formatDate(row.Date);
      return formattedRowDate === formattedSelectedDate;
    });

    const dataWithCounter = updateCounter(filtered);
    setFilteredData(dataWithCounter);
    setSnackbar({
      open: true,
      message:
        dataWithCounter.length > 0
          ? "Data filtered successfully!"
          : "No data matches the selected date.",
      type: dataWithCounter.length > 0 ? "success" : "error",
    });
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      setSnackbar({
        open: true,
        message: "No data to export!",
        type: "error",
      });
      return;
    }

    // Check if a date is selected
    if (!selectedDate) {
      setSnackbar({
        open: true,
        message: "Please select a date before exporting!",
        type: "error",
      });
      return;
    }

    // Get the selected date from date input or state
    const selectedDatee = new Date(selectedDate ?? ""); 
    const formattedDate = selectedDatee
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-"); // Format as dd-mm-yyyy

    const dataWithCounter = filteredData.map((row, index) => ({
      M: index + 1,
      Date: row.Date,
      "Guest Name": row["Guest Name"],
      Transfer: row.Transfer,
      "Car Type": row["Car Type"],
      Pax: row.Pax,
      Hotel: row.Hotel,
      "Flight No.": row["Flight No."],
      From: row.From,
      "Arr.T": row["Arr.T"],
      "DEP.T": row["DEP.T"],
      REF: row.REF,
      Comment: row.Comment,
      Driver: row.Driver,
    }));

    // Create a new workbook and add data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataWithCounter);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Data ${formattedDate}`);

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `data.xlsx`); 
    saveAs("/template.xlsm", "template.xlsm");

    setSnackbar({
      open: true,
      message: "Filtered data file exported successfully!",
      type: "success",
    });
  };

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredData(sortedData);
  };

  useEffect(() => {
    if (selectedDate && data.length > 0) {
      handleFilterByDate(); 
    }
  }, [data]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
          <CircularProgress />
        </div>
      )}

      {/* Blurred background */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        <div className="p-4 border border-gray-300 rounded-md shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <input
              title="Upload File"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              Select Date
            </label>
            <input
              title="Select Date"
              type="date"
              onChange={handleDateChange}
              className="block w-1/3 text-sm p-2 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleReadFile}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading || !file || !selectedDate}
          >
            Read File
          </button>

          <button
            onClick={handleExport}
            className="ml-2 px-4 py-2 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
            disabled={loading || !filteredData.length}
          >
            Export Data
          </button>
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4 overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort(header)}
                    >
                      {header}
                      {sortConfig?.key === header && (
                        <span>
                          {sortConfig.direction === "ascending" ? "🔼" : "🔽"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {tableHeaders.map((header) => (
                      <td key={header} className="p-2 text-center border">
                        {row[header] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FileUpload;
