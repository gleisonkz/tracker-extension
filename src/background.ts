const audio = new Audio("./assets/audio/cash.mp3");
let previousValue: number;

setTimeout(getData, 5000);
setInterval(getData, 60000);

async function getData() {
  const date = new Date();
  const [day, month, year] = [
    date.getDate().toString().padStart(2, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getFullYear(),
  ];

  const browserURL = `https://www.bcb.gov.br/estabilidadefinanceira/buscanormas?conteudo=DEPIN%20realiza%C3%A7%C3%A3o&dataInicioBusca=${day}%2F${month}%2F${year}&dataFimBusca=${day}%2F${month}%2F${year}&tipoDocumento=Comunicado`;
  const apiURL = `https://www.bcb.gov.br/api/search/app/normativos/buscanormativos?querytext=ContentType:normativo%20AND%20contentSource:normativos%20AND%20DEPIN%20realiza%C3%A7%C3%A3o%20AND%20TipodoNormativoOWSCHCS=%22Comunicado%22&rowlimit=15&startrow=0&sortlist=Data1OWSDATE:descending&refinementfilters=Data:range(datetime(${year}-${month}-${day}),datetime(${year}-${month}-${day}T23:59:59))`;

  const data = await fetch(apiURL).then((response) => response.json());
  const { TotalRows: totalRows } = data;

  if (totalRows && previousValue !== totalRows) {
    previousValue = totalRows;

    chrome.notifications.create("notification", {
      title: "Publicação nova disponível",
      message: "How great it is!",
      iconUrl: "./assets/image/robot-face.png",
      type: "basic",
    });

    chrome.notifications.onClicked.addListener((notificationID: string) => {
      if (notificationID === "notification") {
        chrome.tabs.create({ url: browserURL });
      }
    });

    audio.play();
  }
}
