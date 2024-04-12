import pdfDocuments from "pdfkit";
import getContrastResults from "../../src/color-checker.js";

const PALETTE_X = 35;
const RESULTS_X = 145;
const RESULTS_MAX_COLS = 6;
const RESULTS_MAX_ROWS = 6;
const RESULT_SIZE = 60;
const RESULT_INLINE_SPACING = 72;
const RESULT_BLOCK_SPACING = 80;

let levelAAA = false;

export default async (req, context) => {
  // get the origin
  const allowList = [
    "studionoel.co.uk",
    "https://stgstudionoel.wpengine.com/",
    "http://stgstudionoel.local/",
  ];

  if (req.method === "OPTIONS") {
    // You need this if you are calling this from the browser
    // to handle CORS preflight stuff

    const headers = {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTION",
      "Content-Type": "application/pdf",
    };

    const url = new URL(req.url);
    if (allowList.indexOf(url.origin) > -1) {
      console.log("allow");
      headers["Access-Control-Allow-Origin"] = url.origin;
    }

    return new Response("ok", { headers: headers });
  }

  if (req.method != "POST" || !req.body) {
    return new Response("Use POST to submit your palette", { status: 400 });
  }

  const body = await req.json();

  if (!body.palette) {
    return new Response("No palette was received", { status: 400 });
  }

  if (body.levelAAA) {
    levelAAA = body.levelAAA;
  }

  // get the palette and test
  const results = getContrastResults(body.palette, levelAAA);

  // build pdf
  const data = await makePDF(results);

  // create a valid response

  // Set headers
  const headers = new Headers();

  headers.set("Content-Type", "application/pdf");
  headers.set(
    "Content-Disposition",
    "attachment; filename='accessible-colour-palette.pdf'"
  );

  const url = new URL(req.url);
  if (allowList.indexOf(url.origin) > -1) {
    console.log("allow");
    headers.set("Access-Control-Allow-Origin", url.origin);
  }

  return new Response(data, {
    headers: headers,
  });
};

const makePDF = async (colors) => {
  return new Promise((resolve) => {
    const doc = new pdfDocuments({
      autoFirstPage: false,
      size: "A4",
      margin: 0,
      font: "./netlify/functions/fonts/GT-America-Regular.otf",
      info: {
        Title: "Accessible Colour Palette",
        Author: "Studio Noel",
      },
    });

    doc.registerFont(
      "GT-Bold",
      "./netlify/functions/fonts/GT-America-Standard-Bold.otf"
    );
    doc.registerFont(
      "GT-Regular",
      "./netlify/functions/fonts/GT-America-Regular.otf"
    );
    doc.registerFont(
      "GT-Light",
      "./netlify/functions/fonts/GT-America-Standard-Light.otf"
    );
    doc.registerFont(
      "Clearface",
      "./netlify/functions/fonts/ITC-ClearfaceStd-Regular.otf"
    );

    // this will hold an array of colour results, reorded to fit across pages neatly
    let pageColorArr = [[]];
    let pageIndex = 0;

    // start with an empty page and max rows available
    let rowsAvailableOnPage = RESULTS_MAX_ROWS;

    // go through each color and decided if it fits on 1 page or we shoudl start a next page
    colors.forEach((c) => {
      const safeResults = c.results.filter((r) => {
        return r.result != "not-safe";
      }).length;

      const rowsNeeded = Math.ceil(safeResults / RESULTS_MAX_COLS);

      if (rowsAvailableOnPage >= rowsNeeded) {
        // add to existing page
        pageColorArr[pageIndex].push(c);
        rowsAvailableOnPage -= rowsNeeded;
      } else {
        // start a new page
        rowsAvailableOnPage = RESULTS_MAX_ROWS;
        pageIndex++;
        pageColorArr[pageIndex] = [];
        pageColorArr[pageIndex].push(c);
        rowsAvailableOnPage -= rowsNeeded;
      }
    });

    // let num_pages = Math.ceil(colors.length / 6);
    let start = 0;

    for (let p = 0; p < pageColorArr.length; p++) {
      doc.addPage({ size: "A4", margin: 0 });

      // HEADER
      addPageHeader(doc);

      // CONTENT
      addPageContent(doc, pageColorArr[p]);

      // FOOTER
      addPageFooter(doc);
    }

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdf = Buffer.concat(buffers);
      resolve(pdf);
    });
    doc.end();
  });
};

function addPageHeader(doc) {
  doc.rect(0, 0, 595, 186).fill("#3472D8");

  //
  doc.fontSize(30);
  doc.fill("#000000");
  doc.font("GT-Bold");
  doc.text("ACCESSIBLE COLOUR PALETTE", 19, 16, { width: 300 });

  //
  doc.fontSize(16);
  doc.fill("#ffffff");
  doc.font("GT-Light");
  doc.text("The following colours are accessible to", 19, 96, { width: 217 });

  //
  doc.font("GT-Bold");
  if (levelAAA) {
    doc.text("WCAG 2.2 AAA standards");
  } else {
    doc.text("WCAG 2.2 AA standards");
  }

  //
  doc.roundedRect(343, 16, 200, 141, 8).fill("#ffffff");
  doc.fontSize(22);
  doc.fill("#000000");
  doc.font("Clearface");
  doc.text("Accessibility is about more than just colour", 356, 32, {
    width: 149,
  });

  //
  doc.fontSize(11);
  doc.font("GT-Bold");
  doc.text("download our full brand accessibility guide", { width: 130 });

  //
  doc
    .polygon(
      [526.22, 40],
      [559.6, 40],
      [554.94, 78.71],
      [578, 70.76],
      [543, 124],
      [508, 70.76],
      [531.1, 78.71]
    )
    .fill("#000000");
  doc.rect(508, 131, 72, 8).fill("#000000");
  //
  doc.link(
    343,
    16,
    200,
    141,
    "https://studionoel.co.uk/download-accessibility-guide"
  );
}

function addPageContent(doc, colors) {
  doc.font("GT-Bold");
  doc.fontSize(11);
  doc.text("Palette tested", PALETTE_X, 207);
  doc.text(
    (levelAAA ? "AAA" : "AA") + " compliant text colour combinations",
    RESULTS_X,
    207
  );

  // set the x & y for the layout
  let x = PALETTE_X;
  let y = 234;

  colors.forEach((color) => {
    doc.rect(x, y, RESULT_SIZE, RESULT_SIZE).fill(color.color);

    doc.font("GT-Light");
    doc.fill("#000000");
    doc.text(color.color, x, y + RESULT_SIZE, {
      width: RESULT_SIZE,
      align: "center",
    });

    // set starting position for results
    x = RESULTS_X;

    let num_safe_results = 0;
    let currentCol = 0;

    // add any compliant colours
    color.results.forEach((result) => {
      // skip unsafe valies
      if (result.result == "not-safe") {
        return;
      }

      if (currentCol >= RESULTS_MAX_COLS) {
        currentCol = 0;
        x = RESULTS_X;
        y += RESULT_BLOCK_SPACING;
      }

      // background box
      doc.rect(x, y, RESULT_SIZE, RESULT_SIZE).fill(color.color);
      // foreground text
      doc.font("GT-Bold");
      doc.fill(result.color);
      doc.text(result.color, x, y + 22, {
        width: RESULT_SIZE,
        align: "center",
      });
      // compliant result
      doc.font("GT-Light");
      doc.fill("#000000");
      doc.text(result.label, x, y + RESULT_SIZE, {
        width: RESULT_SIZE,
        align: "center",
      });

      x += RESULT_INLINE_SPACING;
      num_safe_results++;
      currentCol++;
    });

    if (num_safe_results == 0) {
      doc.font("GT-Light");
      doc.fill("#000000");
      doc.text(
        "There are no " +
          (levelAAA ? "AAA" : "AA") +
          " compliant results for this colour.",
        x,
        y
      );
    }

    // move down on to next row
    y += RESULT_BLOCK_SPACING + 20;

    // reset x
    x = PALETTE_X;
  });
}

function addPageFooter(doc) {
  doc.rect(0, 785, 595, 60).fill("#FEF1E3");

  doc.font("GT-Bold");
  doc.fontSize(9);
  doc.fill("#000000");
  doc.text("studionoel.co.uk", 464, 811, { width: 114, align: "right" });
}
