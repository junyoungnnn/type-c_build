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

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NewsLink = styled.li`
  margin: 10px 0;
  font-size: 16px;
  a {
    display: block;
    padding: 10px;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    text-decoration: none;
    border-radius: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${(props) => props.theme.accentColor};
      color: white;
    }
  }
`;

interface INewsItem {
  title: string;
  link: string | null;
}

function News() {
  const {
    isLoading: newsListLoading,
    data: newsTextData,
    error,
  } = useQuery<string | null>("allNews", fetchNews);

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
        <NewsList>
          {newsTextData ? (
            <pre>{newsTextData}</pre>
          ) : (
            <Loader>No news data available.</Loader>
          )}
        </NewsList>
      )}
    </>
  );
}

export default News;
