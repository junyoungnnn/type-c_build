import React, { useState, useEffect } from "react";
import { fetchNews } from "./api";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.background};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${(props) => props.theme.blue.darker};
  text-align: center;
  margin: 100px 0 50px 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    font-size: 28px;
    margin: 80px 0 40px 0;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin: 60px 0 30px 0;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  margin-top: 50px;
`;

const ErrorMessage = styled.span`
  text-align: center;
  display: block;
  font-size: 18px;
  color: red;
  margin-top: 50px;
`;

const NewsTableContainer = styled.div`
  overflow-x: auto;
`;

const NewsList = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th,
  td {
    padding: 12px 15px;
    border: 1px solid ${(props) => props.theme.borderColor};
    text-align: left;
    font-size: 16px;

    @media (max-width: 480px) {
      font-size: 14px;
      padding: 8px 10px;
    }
  }

  th {
    background-color: ${(props) => props.theme.headerBgColor};
    color: ${(props) => props.theme.headerTextColor};
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:nth-child(even) {
    background-color: ${(props) => props.theme.rowEvenBgColor};
  }

  tbody tr:hover {
    background-color: ${(props) => props.theme.rowHoverBgColor};
    cursor: pointer;
  }

  a {
    color: ${(props) => props.theme.black.veryDark};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${(props) => props.theme.linkHoverColor};
      text-decoration: underline;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 10px 16px;
  background-color: ${(props) =>
    props.active ? props.theme.blue.darker : props.theme.bgColor};
  color: ${(props) => (props.active ? "#ffffff" : props.theme.textColor)};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.blue.darker};
    color: #ffffff;
  }

  &:disabled {
    background-color: ${(props) => props.theme.disabledBgColor};
    color: ${(props) => props.theme.disabledTextColor};
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

interface INewsItem {
  num: string;
  title: string;
  date: string;
  link: string | null;
}

function News() {
  const [page, setPage] = useState(1);
  const [newsItemsCache, setNewsItemsCache] = useState<{
    [key: number]: INewsItem[];
  }>({});
  const [newsItems, setNewsItems] = useState<INewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageGroup, setPageGroup] = useState(0);
  const [pageCount, setPageCount] = useState(10); // 페이지 버튼 개수 상태 추가

  const startPage = pageGroup * pageCount + 1;
  const endPage = startPage + pageCount - 1;

  const fetchNewsData = (pageNumber: number) => {
    setIsLoading(true);
    setError(null);

    if (newsItemsCache[pageNumber]) {
      setNewsItems(newsItemsCache[pageNumber]);
      setIsLoading(false);
      return;
    }

    fetchNews(pageNumber)
      .then((data) => {
        setNewsItems(data);
        setNewsItemsCache((prevCache) => ({
          ...prevCache,
          [pageNumber]: data,
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNewsData(page);
  }, [page]);

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleNextGroup = () => {
    setPageGroup((prev) => prev + 1);
  };

  const handlePrevGroup = () => {
    setPageGroup((prev) => (prev > 0 ? prev - 1 : 0));
  };

  useEffect(() => {
    setPage(startPage);
  }, [pageGroup]);

  // 화면 크기에 따라 페이지 버튼 개수 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setPageCount(4);
      } else {
        setPageCount(10);
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 페이지 그룹 변경 시 startPage와 endPage를 재계산
  useEffect(() => {
    setPageGroup(Math.floor((page - 1) / pageCount));
  }, [pageCount, page]);

  if (error) {
    return (
      <Container>
        <Helmet>
          <title>News</title>
        </Helmet>
        <Title>해양수산 뉴스</Title>
        <ErrorMessage>뉴스를 불러오는 중 오류가 발생했습니다.</ErrorMessage>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>해양수산 뉴스</title>
      </Helmet>

      <Container>
        <Title>해양수산 뉴스</Title>
        {isLoading ? (
          <Loader>로딩 중...</Loader>
        ) : (
          <>
            <NewsTableContainer>
              <NewsList>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {newsItems && newsItems.length > 0 ? (
                    newsItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.num}</td>
                        <td>
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </td>
                        <td>{item.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>뉴스가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </NewsList>
            </NewsTableContainer>

            <Pagination>
              <PageButton onClick={handlePrevGroup} disabled={pageGroup === 0}>
                이전
              </PageButton>
              {Array.from({ length: pageCount }, (_, i) => {
                const pageNumber = startPage + i;
                return (
                  <PageButton
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    active={page === pageNumber}
                  >
                    {pageNumber}
                  </PageButton>
                );
              })}
              <PageButton onClick={handleNextGroup}>다음</PageButton>
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
}

export default News;
