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

const mof_URL = `https://www.mof.go.kr/doc/ko/selectDocList.do?menuSeq=971&bbsSeq=10&listUpdtDt=2024-08-20`;

export function fetchNews() {
  return fetch(`${News_fetch_URL}proxy?key=${News_Key}&reqLink=${mof_URL}`)
    .then((response) => response.text()) // HTML을 텍스트로 받습니다.
    .then((htmlString) => {
      console.log("Fetched HTML string:", htmlString); // HTML 내용을 확인하기 위한 로그

      // DOMParser를 사용하여 HTML을 파싱합니다.
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      // 'link-t' 클래스를 가진 모든 <a> 태그를 선택합니다.
      const newsItems = Array.from(doc.querySelectorAll("a.link-t"));

      console.log("Parsed news items:", newsItems); // 파싱된 뉴스 항목 확인

      // 각 항목에서 필요한 정보를 추출합니다.
      return newsItems.map((item) => {
        const onclickAttr = item.getAttribute("onclick");
        let id = null;

        // 'onclick' 속성이 있는지 확인하고, 숫자를 추출합니다.
        if (onclickAttr) {
          const match = onclickAttr.match(/\d+/);
          if (match) {
            id = match[0];
          }
        }

        return {
          title: item.getAttribute("title") || "",
          id: id,
          link: id
            ? `https://www.mof.go.kr/doc/ko/selectDoc.do?docSeq=${id}&menuSeq=971&bbsSeq=10`
            : null,
        };
      });
    })
    .then((newsList) => {
      console.log("Parsed news list:", newsList); // 최종 뉴스 목록 확인
      return newsList;
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      return [];
    });
}
