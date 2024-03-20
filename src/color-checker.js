import Color from "colorjs.io";

function getContrastResults(palette, levelAAA= false){
  let matrix = [];

  // loop through each color in the palette and add
  palette.forEach((backgroundColor) => {
    let results = [];

    // nested loop to compare the background color to each other colour
    palette.forEach((foregroundColor) => {
      // check it is a different colour
      if (backgroundColor != foregroundColor) {
        // get the contrast ratio
        let c1 = new Color(backgroundColor);
        let c2 = new Color(foregroundColor);
        let ratio = c1.contrastWCAG21(c2);
        // get the pass/fail values needed
        let normalTextThreshold = levelAAA ? 7 : 4.5;
        let largeTextThreshold = levelAAA ? 4.5 : 3;


        // add the colour being tested to the data
        let result = { color: foregroundColor };

        // add the contrast ratio to the data
        result.ratio = ratio;

        if (ratio >= normalTextThreshold) {
          result.result = "safe";
          result.label = (levelAAA ? "AAA" : "AA") + " Safe";
        } else if (ratio >= largeTextThreshold) {
          result.result = "large-only";
          result.label = "Large only";
        } else {
          result.result = "not-safe";
          result.label = "Not " + (levelAAA ? "AAA" : "AA") + " Safe";
        }

        // add the result
        results.push(result);
      }
    });

    matrix.push({ color: backgroundColor, results: results });
  });

  return matrix;
}

export default getContrastResults;