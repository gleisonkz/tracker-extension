const audio = new Audio("./assets/audio/cash.mp3");
audio.play();

const newURL = "https://www.climaaovivo.com.br/mg/belo-horizonte/regiao-central";

let activeTab: chrome.tabs.Tab = null;
let updated = false;

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: newURL }, (tab) => {
    activeTab = tab;
    chrome.tabs.executeScript(null, { file: "./content.js" });
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url.indexOf(newURL) > -1 && changeInfo.status === "complete" && updated) {
    console.log("CHANGE");
    chrome.tabs.executeScript(activeTab.id, { file: "./content.js" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "storage-change") {
    chrome.storage.local.get("last-data", (value) => {
      console.log(value);
      updated = true;
      chrome.tabs.reload(activeTab.id);
    });
  }
});
