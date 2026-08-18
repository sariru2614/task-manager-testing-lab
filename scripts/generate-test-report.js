const fs = require('fs');
const path = require('path');

// Rutas de los archivos generados por Jest
const rootDir = path.resolve(__dirname, '..');

const testResultsPath = path.join(
  rootDir,
  'test-results.json'
);

const coverageSummaryPath = path.join(
  rootDir,
  'coverage',
  'coverage-summary.json'
);

const outputPath = path.join(
  rootDir,
  'coverage',
  'reporte-ejecucion.html'
);

// Validar que existan los archivos necesarios
if (!fs.existsSync(testResultsPath)) {
  console.error(
    'No se encontró test-results.json.\n' +
    'Ejecuta primero:\n' +
    'npx jest --coverage --ci --json --outputFile=test-results.json'
  );
  process.exit(1);
}

if (!fs.existsSync(coverageSummaryPath)) {
  console.error(
    'No se encontró coverage/coverage-summary.json.'
  );
  process.exit(1);
}

// Leer resultados
const testResults = JSON.parse(
  fs.readFileSync(testResultsPath, 'utf8')
);

const coverageSummary = JSON.parse(
  fs.readFileSync(coverageSummaryPath, 'utf8')
);

const coverage = coverageSummary.total;
const threshold = 70;

// Datos de suites
const totalSuites = testResults.numTotalTestSuites || 0;
const passedSuites = testResults.numPassedTestSuites || 0;
const failedSuites = testResults.numFailedTestSuites || 0;

// Datos de pruebas
const totalTests = testResults.numTotalTests || 0;
const passedTests = testResults.numPassedTests || 0;
const failedTests = testResults.numFailedTests || 0;

// Porcentajes de ejecución
const suitesPercentage =
  totalSuites > 0
    ? ((passedSuites / totalSuites) * 100).toFixed(0)
    : 0;

const testsPercentage =
  totalTests > 0
    ? ((passedTests / totalTests) * 100).toFixed(0)
    : 0;

// Datos de cobertura
const statements = coverage.statements.pct;
const branches = coverage.branches.pct;
const functions = coverage.functions.pct;
const lines = coverage.lines.pct;

const coveragePassed =
  statements >= threshold &&
  branches >= threshold &&
  functions >= threshold &&
  lines >= threshold;

// HTML sencillo
const html = `<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Resultado de pruebas</title>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      background: #ffffff;
      color: #222;
    }

    .container {
      max-width: 950px;
      margin: 30px auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 35px;
    }

    h2 {
      font-size: 19px;
      margin-top: 35px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }

    .results {
      display: flex;
      justify-content: center;
      gap: 100px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .result {
      text-align: center;
      min-width: 220px;
    }

    .circle {
      width: 150px;
      height: 150px;
      margin: 0 auto 12px;
      border-radius: 50%;
      background:
        conic-gradient(
          #28a745 calc(var(--value) * 1%),
          #e5e5e5 0
        );

      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .circle::before {
      content: "";
      position: absolute;
      width: 110px;
      height: 110px;
      background: white;
      border-radius: 50%;
    }

    .circle-text {
      position: relative;
      font-size: 22px;
      font-weight: bold;
    }

    .result-title {
      font-weight: bold;
      margin-top: 6px;
    }

    .result-detail {
      margin-top: 5px;
      font-size: 13px;
      color: #555;
    }

    .coverage {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .metric {
      border: 1px solid #ddd;
      padding: 18px 10px;
      text-align: center;
    }

    .metric-name {
      font-size: 13px;
      color: #555;
    }

    .metric-value {
      font-size: 22px;
      font-weight: bold;
      margin-top: 8px;
    }

    .threshold {
      margin-top: 20px;
      padding: 12px 15px;
      background: #f5f5f5;
      border-left: 4px solid #444;
      font-size: 14px;
    }

    .link-report {
      margin-top: 20px;
    }

    .link-report a {
      color: #0066cc;
      text-decoration: none;
    }

    .link-report a:hover {
      text-decoration: underline;
    }

    .note {
      margin-top: 15px;
      font-size: 13px;
      color: #555;
      line-height: 1.5;
    }

    @media (max-width: 700px) {
      .coverage {
        grid-template-columns: repeat(2, 1fr);
      }

      .results {
        gap: 40px;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <h1>Resultado de la ejecución automatizada</h1>

    <div class="results">

      <div class="result">

        <div
          class="circle"
          style="--value: ${suitesPercentage}"
        >
          <span class="circle-text">
            ${passedSuites}/${totalSuites}
          </span>
        </div>

        <div class="result-title">
          Test Suites
        </div>

        <div class="result-detail">
          ${passedSuites} aprobadas ·
          ${failedSuites} fallidas
        </div>

      </div>

      <div class="result">

        <div
          class="circle"
          style="--value: ${testsPercentage}"
        >
          <span class="circle-text">
            ${passedTests}/${totalTests}
          </span>
        </div>

        <div class="result-title">
          Tests
        </div>

        <div class="result-detail">
          ${passedTests} aprobados ·
          ${failedTests} fallidos
        </div>

      </div>

    </div>

    <h2>Resumen de cobertura</h2>

    <div class="coverage">

      <div class="metric">
        <div class="metric-name">
          Statements
        </div>

        <div class="metric-value">
          ${statements}%
        </div>
      </div>

      <div class="metric">
        <div class="metric-name">
          Branches
        </div>

        <div class="metric-value">
          ${branches}%
        </div>
      </div>

      <div class="metric">
        <div class="metric-name">
          Functions
        </div>

        <div class="metric-value">
          ${functions}%
        </div>
      </div>

      <div class="metric">
        <div class="metric-name">
          Lines
        </div>

        <div class="metric-value">
          ${lines}%
        </div>
      </div>

    </div>

    <div class="threshold">

      <strong>
        Umbral mínimo configurado: ${threshold}%
      </strong>

      <br>

      ${
        coveragePassed
          ? 'La cobertura global obtenida cumple con el umbral definido.'
          : 'Una o más métricas se encuentran por debajo del umbral definido.'
      }

    </div>

    <h2>Detalle de cobertura</h2>

    <p class="note">
      Jest genera automáticamente el detalle de cobertura
      por archivo, donde se pueden consultar las sentencias,
      ramas, funciones y líneas cubiertas durante la ejecución.
    </p>

    <div class="link-report">
      <a href="lcov-report/index.html">
        Ver reporte detallado generado por Jest
      </a>
    </div>

  </div>

</body>

</html>`;

// Crear el reporte
fs.mkdirSync(
  path.dirname(outputPath),
  {
    recursive: true,
  }
);

fs.writeFileSync(
  outputPath,
  html,
  'utf8'
);

console.log('');
console.log('Reporte generado correctamente');
console.log('');
console.log(`Test Suites: ${passedSuites}/${totalSuites}`);
console.log(`Tests: ${passedTests}/${totalTests}`);
console.log('');
console.log(`Statements: ${statements}%`);
console.log(`Branches: ${branches}%`);
console.log(`Functions: ${functions}%`);
console.log(`Lines: ${lines}%`);
console.log('');
console.log(`Umbral mínimo: ${threshold}%`);
console.log('');
console.log(`Archivo: ${outputPath}`);