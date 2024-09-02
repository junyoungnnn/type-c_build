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
    .then((response) => response.text()) // HTML�� �ؽ�Ʈ�� �޽��ϴ�.
    .then((htmlString) => {
      console.log("Fetched HTML string:", htmlString); // HTML ������ Ȯ���ϱ� ���� �α�

      // DOMParser�� ����Ͽ� HTML�� �Ľ��մϴ�.
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      // 'link-t' Ŭ������ ���� ��� <a> �±׸� �����մϴ�.
      const newsItems = Array.from(doc.querySelectorAll("a.link-t"));

      console.log("Parsed news items:", newsItems); // �Ľ̵� ���� �׸� Ȯ��

      // �� �׸񿡼� �ʿ��� ������ �����մϴ�.
      return newsItems.map((item) => {
        const onclickAttr = item.getAttribute("onclick");
        let id = null;

        // 'onclick' �Ӽ��� �ִ��� Ȯ���ϰ�, ���ڸ� �����մϴ�.
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
      console.log("Parsed news list:", newsList); // ���� ���� ��� Ȯ��
      return newsList;
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      return [];
    });
}
