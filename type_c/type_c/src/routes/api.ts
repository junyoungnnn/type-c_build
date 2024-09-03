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

export function fetchNews(page: number) {
  const pageURL = `${News_fetch_URL}proxy?key=${News_Key}&reqLink=${mof_URL}&paginationInfo.currentPageNo=${page}`;

  return fetch(pageURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer(); // ArrayBuffer로 데이터를 받습니다.
    })
    .then((buffer) => {
      const decoder = new TextDecoder("utf-8"); // UTF-8로 디코딩
      const textData = decoder.decode(buffer);

      console.log("Fetched text data:", textData);

      // HTML을 파싱하고 뉴스 아이템 추출
      const parser = new DOMParser();
      const doc = parser.parseFromString(textData, "text/html");
      const rows = doc.querySelectorAll("tbody tr");

      const newsItems = Array.from(rows).map((row) => {
        const numElement = row.querySelector(".num");
        const titleElement = row.querySelector(".link-t");
        const dateElement = row.querySelector(".t-date");

        const num = numElement?.textContent?.trim() || "";
        const title = titleElement?.textContent?.trim() || "";
        const date = dateElement?.textContent?.trim() || "";

        const onclickAttr = titleElement?.getAttribute("onclick");

        let id = null;
        if (onclickAttr) {
          const match = onclickAttr.match(/\d+/);
          if (match) {
            id = match[0];
          }
        }

        const link = id
          ? `https://www.mof.go.kr/doc/ko/selectDoc.do?docSeq=${id}&menuSeq=971&bbsSeq=10`
          : null;

        return { num, title, date, link };
      });

      return newsItems;
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      return [];
    });
}
