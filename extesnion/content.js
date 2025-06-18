console.log("[Adversify X] 🟢 Content script active");

function scanPage() {
  const flaggedScripts = [];
  const suspiciousPatterns = [
    /googletagmanager/i,
    /doubleclick/i,
    /adservice/i,
    /track/i,
    /analytics/i,
    /pixel/i,
    /ads/i,
    /gpt\.js/i,
    /cdn\.adsafeprotected/i,
    /pubads/i,
    /ob\.js/i,
    /usersync/i,
    /sharedid/i
  ];

  const scripts = [...document.querySelectorAll("script")];

  scripts.forEach((script) => {
    const src = script.src || script.textContent;
    if (
      suspiciousPatterns.some((pattern) => pattern.test(src)) &&
      !flaggedScripts.includes(src)
    ) {
      flaggedScripts.push(src.slice(0, 200));
    }
  });

  console.log(`[Adversify X] 🚨 Found ${flaggedScripts.length} suspicious scripts.`);
  return flaggedScripts;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "analyze_page") {
    const result = scanPage();
    sendResponse({ flagged: result });
  }
});
