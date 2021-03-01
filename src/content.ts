setTimeout(() => {
  getData();
}, 3000);

function getData() {
  var $span: HTMLSpanElement = document.querySelector("span.temp");
  var randomValue = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
  $span.innerText = randomValue.toString();

  var value = $span.innerText;

  chrome.storage.local.set({ "last-data": value });
  chrome.runtime.sendMessage({ message: "storage-change" });
}
