// Score mapping for each option
const scoreMap = {
  Q1_A: { genotype: "Producer", effectiveness: "Goal Model" },
  Q1_B: { genotype: "Broker", effectiveness: "Competing Values Model" },
  Q1_C: { genotype: "Integrator", effectiveness: "Internal Process Model" },

  Q2_A: { genotype: "Producer", effectiveness: "Goal Model" },
  Q2_B: { genotype: "Integrator", effectiveness: "Competing Values Model" },
  Q2_C: { genotype: "Monitor", effectiveness: "Internal Process Model" },

  Q3_A: { genotype: "Producer", effectiveness: "Goal Model" },
  Q3_B: { genotype: "Integrator", effectiveness: "Competing Values Model" },
  Q3_C: { genotype: "Coordinator", effectiveness: "Internal Process Model" },
};

function calculateResult() {
  const form = document.getElementById('assessmentForm');
  const formData = new FormData(form);

  let genotypeScores = {};
  let effectivenessScores = {};
  const totalQuestions = 3;
  let allAnswered = true;

  for (let i = 1; i <= totalQuestions; i++) {
    const value = formData.get(`Q${i}`);
    if (!value) {
      allAnswered = false;
      break;
    }

    const entry = scoreMap[value];
    if (entry.genotype) {
      genotypeScores[entry.genotype] = (genotypeScores[entry.genotype] || 0) + 1;
    }
    if (entry.effectiveness) {
      effectivenessScores[entry.effectiveness] = (effectivenessScores[entry.effectiveness] || 0) + 1;
    }
  }

  const resultDiv = document.getElementById('result');
  if (!allAnswered) {
    resultDiv.innerHTML = `<span style="color: red;">Please answer all questions before submitting.</span>`;
    return;
  }

  // Calculate percentages
  const genotypePercentages = {};
  for (const key in genotypeScores) {
    genotypePercentages[key] = Math.round((genotypeScores[key] / totalQuestions) * 100);
  }

  const effectivenessPercentages = {};
  for (const key in effectivenessScores) {
    effectivenessPercentages[key] = Math.round((effectivenessScores[key] / totalQuestions) * 100);
  }

  // Find top genotype and effectiveness
  const topGenotype = Object.entries(genotypePercentages).sort((a,b)=>b[1]-a[1])[0];
  const topEffectiveness = Object.entries(effectivenessPercentages).sort((a,b)=>b[1]-a[1])[0];

  // Display textual result
  let html = `<h3>Assessment Result</h3>`;
  html += `<p><strong>You are most likely to use:</strong> ${topGenotype[0]} (${topGenotype[1]}%) and ${topEffectiveness[0]} (${topEffectiveness[1]}%)</p>`;
  html += `<h4>Genotypic Function Percentages:</h4><ul>`;
  for (const [key,val] of Object.entries(genotypePercentages)) {
    html += `<li>${key} – ${val}%</li>`;
  }
  html += `</ul><h4>Organisational Effectiveness Percentages:</h4><ul>`;
  for (const [key,val] of Object.entries(effectivenessPercentages)) {
    html += `<li>${key} – ${val}%</li>`;
  }
  html += `</ul>`;
  resultDiv.innerHTML = html;

  // Render Charts
  renderChart('genotypeChart', 'Genotypic Functions', genotypePercentages);
  renderChart('effectivenessChart', 'Effectiveness Models', effectivenessPercentages);
}

let genotypeChartInstance = null;
let effectivenessChartInstance = null;

function renderChart(canvasId, title, dataObj) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const labels = Object.keys(dataObj);
  const data = Object.values(dataObj);

  const chartConfig = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '% of total questions',
        data: data,
        backgroundColor: '#3498db',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 18 }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  };

  // Destroy previous chart if exists
  if (canvasId === 'genotypeChart' && genotypeChartInstance) genotypeChartInstance.destroy();
  if (canvasId === 'effectivenessChart' && effectivenessChartInstance) effectivenessChartInstance.destroy();

  const newChart = new Chart(ctx, chartConfig);

  if (canvasId === 'genotypeChart') genotypeChartInstance = newChart;
  if (canvasId === 'effectivenessChart') effectivenessChartInstance = newChart;
}
