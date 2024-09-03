import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchNews } from "./api";
import { Helmet } from "react-helmet-async";

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
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

interface INewsItem {
  num: string;
  title: string;
  date: string;
  link: string | null;
}

function News() {
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const {
    isLoading,
    data: newsItems,
    error,
  } = useQuery<INewsItem[]>(["news", page], () => fetchNews(page));

  const pageCount = 10;
  const startPage = pageGroup * pageCount + 1;
  const endPage = startPage + pageCount - 1;

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
      <Title>News Date: {new Date().toISOString().split("T")[0]}</Title>
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
    </>
  );
}

export default News;
