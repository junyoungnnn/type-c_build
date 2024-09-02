const Base_URL = `${process.env.REACT_APP_FISHS_BASE_URL}`;
const News_fetch_URL = `${process.env.REACT_APP_NEWS_URL}`;
const News_Key = `${process.env.REACT_APP_NEWS_KEY}`;

export function fetchFishList() {
  return fetch(`${Base_URL}fishList`).then((response) => response.json());
}

export function fetchFishRealPrice(
  fishName: string,
  fishCode: string,
  startDate: string,
  endDate: string
) {
  return fetch(
    `${Base_URL}real?fishName=${fishName}&fishCode=${fishCode}&startDate=${startDate}&endDate=${endDate}`
  ).then((response) => response.json());
}

export function fetchFishPredictPrice(
  fishName: string,
  startDate: string,
  endDate: string
) {
  return fetch(
    `${Base_URL}predict?fishName=${fishName}&startDate=${startDate}&endDate=${endDate}`
  ).then((response) => response.json());
}

const mof_URL =
  "https%3A%2F%2Fwww.mof.go.kr%2Fdoc%2Fko%2FselectDocList.do%3FmenuSeq%3D971%26bbsSeq%3D10%26listUpdtDt%3D2024-08-20";

console.log(
  `요청URL: ${News_fetch_URL}proxy?key=${News_Key}&reqLink=${mof_URL}`
);

export function fetchNews() {
  return fetch(`${News_fetch_URL}proxy?key=${News_Key}&reqLink=${mof_URL}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer(); // ArrayBuffer로 데이터를 받습니다.
    })
    .then((buffer) => {
      // TextDecoder를 사용하여 UTF-8로 디코딩
      const decoder = new TextDecoder("utf-8"); // "euc-kr" 또는 다른 인코딩으로도 시도 가능
      const textData = decoder.decode(buffer);

      console.log("Fetched text data:", textData);

      return textData;
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      return null;
    });
}
