import React, { useState, useEffect } from "react";
import { fetchNews } from "./api";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: black;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  a {
    text-decoration: none;
    color: white;
    font-weight: bold;
  }
`;

const HighlightedText = styled.span`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${(props) => props.theme.accentColor};
  text-align: center;
  margin: 20px 0;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const NewsList = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border: 1px solid ${(props) => props.theme.borderColor};
    text-align: left;
  }

  th {
    background-color: ${(props) => props.theme.bgColor};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    margin: 0 5px;
    padding: 8px 12px;
    background-color: ${(props) => props.theme.bgColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${(props) => props.theme.accentColor};
      color: white;
    }

    &:disabled {
      background-color: ${(props) => props.theme.disabledBgColor};
      cursor: not-allowed;
    }
  }
`;

const Footer = styled.footer`
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  margin-top: 20px;
  position: relative;
  left: 0;
  bottom: 0;
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

  const pageCount = 10;
  const startPage = pageGroup * pageCount + 1;
  const endPage = startPage + pageCount - 1;

  const fetchNewsData = (pageNumber: number) => {
    setIsLoading(true);
    setError(null);

    // 캐시에 해당 페이지 데이터가 있으면 사용
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

  if (error) {
    return <Loader>Error fetching news.</Loader>;
  }

  return (
    <>
      <Helmet>
        <title>News</title>
      </Helmet>
      <Header>
        <Nav>
          <HighlightedText>Type-C</HighlightedText>
          <Link to={`/type-c_build`}>Home</Link>
          <Link to={"/news"}>News</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </Nav>
      </Header>
      <Container>
        <Title>Today Date: {new Date().toISOString().split("T")[0]}</Title>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <NewsList>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Date</th>
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
                    <td colSpan={3}>No news available.</td>
                  </tr>
                )}
              </tbody>
            </NewsList>

            <Pagination>
              <button onClick={handlePrevGroup} disabled={pageGroup === 0}>
                Prev
              </button>
              {Array.from({ length: pageCount }, (_, i) => {
                const pageNumber = startPage + i;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    disabled={page === pageNumber}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button onClick={handleNextGroup}>Next</button>
            </Pagination>
          </>
        )}
      </Container>
      <Footer>
        <p>&copy; 2024 수산물 가격 예측. All rights reserved.</p>
      </Footer>
    </>
  );
}

export default News;
