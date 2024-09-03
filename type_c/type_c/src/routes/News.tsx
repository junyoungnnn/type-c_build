import styled from "styled-components";
import React from "react";
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

const NewsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${(props) => props.theme.bgColor};
  }
`;

interface INewsItem {
  title: string;
  link: string | null;
}

function News() {
  const {
    isLoading: newsListLoading,
    data: newsListData,
    error,
  } = useQuery<INewsItem[]>("allNews", fetchNews);

  if (error) {
    return <Loader>Error fetching news.</Loader>;
  }

  return (
    <>
      <Helmet>
        <title>News</title>
      </Helmet>
      <Title>News Date: {new Date().toISOString().split("T")[0]}</Title>
      {newsListLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <NewsTable>
          <thead>
            <tr>
              <TableHeader>번호</TableHeader>
              <TableHeader>제목</TableHeader>
            </tr>
          </thead>
          <tbody>
            {newsListData && newsListData.length > 0 ? (
              newsListData.map((item, index) => (
                <TableRow key={index}>
                  <TableData>{index + 1}</TableData>
                  <TableData>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span>{item.title} (Link unavailable)</span>
                    )}
                  </TableData>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableData colSpan={2}>No news data available.</TableData>
              </TableRow>
            )}
          </tbody>
        </NewsTable>
      )}
    </>
  );
}

export default News;
