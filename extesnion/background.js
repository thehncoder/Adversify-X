let lastFlagged = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scripts_found") {
    lastFlagged = message.flagged;
  }

  if (message.action === "analyze") {
    sendResponse({
      result: lastFlagged.length
        ? `⚠️ ${lastFlagged.length} threats detected.`
        : "✅ No threats found.",
      flagged: lastFlagged
    });
  }
});
