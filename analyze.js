const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");

const results = [];

function analyzeImage(src, label) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let total = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        total += gray;
        count++;
      }

      const avgIntensity = total / count;
      results.push({ image: src, label, avgIntensity });
      resolve();
    };
  });
}

async function runAnalysis() {
  const normalImages = [
    "data/normal/n1.png"
  ];

  const pneumoniaImages = [
    "data/pneumonia/p1.png"
  ];

  for (const img of normalImages) {
    await analyzeImage(img, "Normal");
  }

  for (const img of pneumoniaImages) {
    await analyzeImage(img, "Pneumonia");
  }

  displayResults();
}

function displayResults() {
  let text = "Image\tLabel\tAvg Intensity\n";
  text += "----------------------------------\n";

  results.forEach(r => {
    text += `${r.image}\t${r.label}\t${r.avgIntensity.toFixed(2)}\n`;
  });

  output.textContent = text;
}

runAnalysis();

