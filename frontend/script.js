const form = document.getElementById("bodyfatForm");
const fillSampleBtn = document.getElementById("fillSample");
const predictBtn = document.getElementById("predictBtn");

const resultCard = document.getElementById("resultCard");

const predictionValue = document.getElementById("predictionValue");
const category = document.getElementById("category");
const description = document.getElementById("description");
const progressFill = document.getElementById("progressFill");

const API_URL = "http://127.0.0.1:8000/predict";

// Hide result initially
resultCard.style.display = "none";

// ----------------------
// Sample Data
// ----------------------

fillSampleBtn.addEventListener("click", () => {
  form.Age.value = 30;
  form.Weight.value = 180;
  form.Height.value = 70;

  form.Neck.value = 39;
  form.Chest.value = 104;
  form.Abdomen.value = 92;
  form.Hip.value = 101;

  form.Thigh.value = 60;
  form.Knee.value = 40;
  form.Ankle.value = 24;

  form.Biceps.value = 35;
  form.Forearm.value = 30;
  form.Wrist.value = 18;
});

// ----------------------
// Submit
// ----------------------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  predictBtn.disabled = true;
  predictBtn.textContent = "Predicting...";

  const data = {
    Age: Number(form.Age.value),
    Weight: Number(form.Weight.value),
    Height: Number(form.Height.value),

    Neck: Number(form.Neck.value),
    Chest: Number(form.Chest.value),
    Abdomen: Number(form.Abdomen.value),
    Hip: Number(form.Hip.value),

    Thigh: Number(form.Thigh.value),
    Knee: Number(form.Knee.value),
    Ankle: Number(form.Ankle.value),

    Biceps: Number(form.Biceps.value),
    Forearm: Number(form.Forearm.value),
    Wrist: Number(form.Wrist.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Server Error");
    }

    const result = await response.json();

    const bodyFat = Number(result.body_fat_percentage);

    showResult(bodyFat);
  } catch (err) {
    console.error(err);

    alert("Could not reach FastAPI server.");
  } finally {
    predictBtn.disabled = false;
    predictBtn.textContent = "Predict Body Fat";
  }
});

// ----------------------
// Show Result
// ----------------------

function showResult(value) {
  resultCard.style.display = "block";

  animateNumber(value);

  progressFill.style.width = (Math.min(value, 40) / 40) * 100 + "%";

  if (value < 10) {
    category.textContent = "Lean";
    category.className = "category lean";

    description.textContent = "Your estimated body fat is very low.";
  } else if (value < 20) {
    category.textContent = "Healthy";
    category.className = "category healthy";

    description.textContent =
      "Your estimated body fat falls within the healthy range.";
  } else if (value < 30) {
    category.textContent = "High";
    category.className = "category high";

    description.textContent =
      "Your estimated body fat is above the healthy range.";
  } else {
    category.textContent = "Obese";
    category.className = "category obese";

    description.textContent =
      "Your estimated body fat is in the obesity range.";
  }
}

// ----------------------
// Number Animation
// ----------------------

function animateNumber(target) {
  let current = 0;

  const duration = 1000;

  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;

      clearInterval(timer);
    }

    predictionValue.textContent = current.toFixed(1);
  }, 16);
}
