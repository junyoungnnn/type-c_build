import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchFishRealPrice, fetchFishPredictPrice } from "./api";
import { Helmet } from "react-helmet-async";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import {
  endDateAtom,
  isDarkAtom,
  oneWeekDateAtom,
  oneMonthLastAtom,
  halfYearLastAtom,
} from "../atom";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 680px;
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
  gap: 15px;
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
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

interface RouteParams {
  fishName: string;
}

interface IRealPriceData {
  data: IRealData[];
}

interface IRealData {
  fishName: string;
  date: string;
  realPrice: number;
}

interface IPredictPriceData {
  data: IPredictData[];
}

interface IPredictData {
  fishName: string;
  predictDate: string;
  predictPrice: number;
}

function Fish() {
  const { fishName } = useParams<RouteParams>();
  const [selectedPeriod, setSelectedPeriod] = useState("7Days"); // 차트 기간 선택 상태
  const endDate = useRecoilValue(endDateAtom);
  const oneWeekDate = useRecoilValue(oneWeekDateAtom);
  const oneMonthDate = useRecoilValue(oneMonthLastAtom);
  const halfYearDate = useRecoilValue(halfYearLastAtom);

  // 사용자가 선택한 기간에 따라 시작 날짜를 동적으로 설정
  const startDate =
    selectedPeriod === "180Days"
      ? halfYearDate
      : selectedPeriod === "30Days"
      ? oneMonthDate
      : oneWeekDate;

  const { isLoading: realPriceLoading, data: realPriceData } =
    useQuery<IRealPriceData>(["realprice", fishName, startDate, endDate], () =>
      fetchFishRealPrice(fishName, startDate, endDate)
    );

  const { isLoading: predictPriceLoading, data: predictPriceData } =
    useQuery<IPredictPriceData>(
      ["predictprice", fishName, startDate, endDate],
      () => fetchFishPredictPrice(fishName, startDate, endDate),
      {
        enabled: selectedPeriod === "30Days" || selectedPeriod === "180Days", // 30일 또는 180일 차트일 때만 predictPriceData를 가져옵니다.
      }
    );

  const isDark = useRecoilValue(isDarkAtom);
  const loading = realPriceLoading || predictPriceLoading;

  // 차트 데이터 설정
  const chartData =
    (selectedPeriod === "30Days" || selectedPeriod === "180Days") &&
    predictPriceData?.data?.length
      ? predictPriceData.data.map((price) => Number(price.predictPrice))
      : realPriceData?.data?.map((price) => Number(price.realPrice)) || [];

  const chartCategories =
    (selectedPeriod === "30Days" || selectedPeriod === "180Days") &&
    predictPriceData?.data?.length
      ? predictPriceData.data.map((date) => String(date.predictDate))
      : realPriceData?.data?.map((date) => String(date.date)) || [];

  console.log("Chart Data:", chartData);
  console.log("Chart Categories:", chartCategories);

  return (
    <>
      <Helmet>
        <title>{fishName} 가격</title>
      </Helmet>
      <Header>
        <Nav>
          <HighlightedText>Type-C</HighlightedText>
          <Link to={`/type-c`}>Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </Nav>
      </Header>
      <Container>
        <Title>{loading ? "Loading..." : fishName}</Title>

        {loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <div>
              <Button onClick={() => setSelectedPeriod("7Days")}>7 Days</Button>
              <Button onClick={() => setSelectedPeriod("30Days")}>
                30 Days
              </Button>
              <Button onClick={() => setSelectedPeriod("180Days")}>
                180 Days
              </Button>
            </div>

            {chartData.length === 0 ? (
              <Loader>No data available for the selected period.</Loader>
            ) : (
              <ApexChart
                type="line"
                series={[
                  {
                    name:
                      selectedPeriod === "30Days" ||
                      selectedPeriod === "180Days"
                        ? "PredictPrice"
                        : "RealPrice",
                    data: chartData,
                  },
                ]}
                options={{
                  theme: {
                    mode: isDark ? "dark" : "light",
                  },
                  chart: {
                    height: 500,
                    width: 700,
                    zoom: {
                      enabled: false,
                    },
                    toolbar: {
                      show: false,
                    },
                    background: "transparent",
                    animations: {
                      enabled: false,
                    },
                  },
                  title: {
                    text:
                      selectedPeriod === "180Days"
                        ? "180 Days Chart"
                        : selectedPeriod === "30Days"
                        ? "30 Days Chart"
                        : "7 Days Chart",
                    align: "left",
                    style: {
                      fontSize: "14px",
                      fontWeight: "bold",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      color: "#263238",
                    },
                  },
                  stroke: {
                    width: [5],
                    curve: "straight",
                  },
                  yaxis: {
                    show: false,
                  },
                  xaxis: {
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: {
                      show: true,
                      style: {
                        colors: "#000000",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "12px",
                      },
                    },
                    categories: chartCategories,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      gradientToColors: ["#0be881"],
                      stops: [0, 100],
                    },
                  },
                  colors: ["#0fbcf9"],
                  tooltip: {
                    y: {
                      formatter: (value) => `${value?.toFixed(0)}원`,
                    },
                  },
                  grid: {
                    borderColor: "#ffffff",
                  },
                }}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default Fish;
