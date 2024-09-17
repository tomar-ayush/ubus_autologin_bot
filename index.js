const fs = require("fs").promises;
const main = require("./test.js");

async function writeDataFile(newData) {
  try {
    const data = await fs.readFile("./data.json", "utf8");
    let jsonData;

    // Step 2: Parse existing data or initialize an empty object if the file is empty or contains invalid JSON
    try {
      jsonData = JSON.parse(data);
      if (typeof jsonData !== "object" || Array.isArray(jsonData)) {
        throw new Error("Unexpected JSON format");
      }
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      jsonData = {};
    }

    Object.assign(jsonData, newData);

    await fs.writeFile(
      "./data.json",
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );
    console.log("Data updated successfully!");
  } catch (err) {
    console.error("Error reading or writing file:", err);
  }
}

async function mainSys() {
  //   const r_no = 2210991427;
  for (let r_no = 2210991400; r_no < 2210992000; r_no++) {
    const userData = await main(r_no);
    const data = {
      [r_no]: userData,
    };
    console.log(data);
    writeDataFile(data);
  }
}

mainSys();
