document.getElementById('scanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: scanPageForThreats
    },
    (results) => {
      const scripts = results[0].result;
      displayResults(scripts);
    }
  );
});

function scanPageForThreats() {
  const suspiciousKeywords = [
    'googletagmanager', 'google-analytics', 'doubleclick', 'adsbygoogle',
    'gpt.js', 'firebase-analytics', 'tracking', 'tracker', 'adsystem'
  ];

  const scriptTags = Array.from(document.scripts);
  const threats = [];

  scriptTags.forEach((script) => {
    if (script.src) {
      for (let keyword of suspiciousKeywords) {
        if (script.src.includes(keyword)) {
          threats.push(script.src);
          break;
        }
      }
    }
  });

  return threats;
}

function displayResults(threats) {
  const resultDiv = document.getElementById('result');

  if (threats.length === 0) {
    resultDiv.innerHTML = `<p class="safe">✅ Page analyzed. No threats found.</p>`;
  } else {
    let riskLevel = 'warning';
    if (threats.length >= 5) riskLevel = 'danger';
    else if (threats.length <= 2) riskLevel = 'safe';

    resultDiv.innerHTML = `
      <p class="${riskLevel}">🚨 Found ${threats.length} suspicious script(s):</p>
      <ul>${threats.map(src => `<li>${src}</li>`).join('')}</ul>
    `;
  }
}
