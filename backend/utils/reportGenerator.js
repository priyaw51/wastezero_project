const fs = require("fs");

// Convert JSON array to CSV string
const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    // extract keys (columns)
    const keys = Object.keys(data[0]._doc || data[0]);

    // header row
    const header = keys.join(",");

    // data rows
    const rows = data.map((item) => {
        const obj = item._doc || item;

        return keys
            .map((key) => {
                let value = obj[key];

                // handle undefined/null
                if (value === undefined || value === null) return "";

                // convert objects/arrays to string
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }

                // escape commas
                return `"${value}"`;
            })
            .join(",");
    });

    return [header, ...rows].join("\n");
};

// Write CSV to file
const generateCSV = (data, filePath) => {
    const csv = convertToCSV(data);
    fs.writeFileSync(filePath, csv);
};

module.exports = { generateCSV };