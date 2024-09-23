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
  category: string,
  startDate: string,
  endDate: string,
  modelName: string
) {
  return fetch(
    `${Base_URL}predict?fishName=${fishName}&category=${category}&startDate=${startDate}&endDate=${endDate}&modelName=${modelName}`
  ).then((response) => response.json());
}

const baseMOF_URL = "https%3A%2F%2Fwww.mof.go.kr%2Fdoc%2Fko%2FselectDocList.do";

export function fetchNews(page: number) {
  // 페이지 번호를 URL에 반영
  const mof_URL = `${baseMOF_URL}%3FpaginationInfo.currentPageNo%3D${page}%26listUpdtDt%3D2024-08-30%2B%2B10%253A00%26menuSeq%3D971%26bbsSeq%3D10`;
  const pageURL = `${News_fetch_URL}proxy?key=${News_Key}&reqLink=${mof_URL}`;

  return fetch(pageURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      const decoder = new TextDecoder("utf-8");
      const textData = decoder.decode(buffer);

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
