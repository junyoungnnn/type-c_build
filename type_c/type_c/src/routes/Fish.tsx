import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchFishRealPrice, fetchFishPredictPrice } from "./api";
import { Helmet } from "react-helmet-async";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { endDateAtom, isDarkAtom, halfYearLastAtom } from "../atom";

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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 15px;
`;

const Button = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.active ? props.theme.accentColor : "#444"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.accentColor};
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

interface RouteParams {
  fishName: string;
}

interface IRealPriceData {
  data: IRealData[];
}

interface IRealData {
  fishName: string;
  fishCode: string;
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
  const [selectedPeriod, setSelectedPeriod] = useState("7Days");
  const [fishCode, setFishCode] = useState("0");
  const [modelName, setModelName] = useState("lstm");
  const endDate = useRecoilValue(endDateAtom);
  const halfYearDate = useRecoilValue(halfYearLastAtom);

  const { isLoading: realPriceLoading, data: realPriceDataResponse } =
    useQuery<IRealPriceData>(
      ["realprice", fishName, fishCode, halfYearDate, endDate],
      () => fetchFishRealPrice(fishName, fishCode, halfYearDate, endDate)
    );

  const { isLoading: predictPriceLoading, data: predictPriceDataResponse } =
    useQuery<IPredictPriceData>(
      ["predictprice", fishName, fishCode, halfYearDate, endDate, modelName],
      () =>
        fetchFishPredictPrice(
          fishName,
          fishCode,
          halfYearDate,
          endDate,
          modelName
        ),
      {
        enabled: selectedPeriod === "30Days" || selectedPeriod === "180Days",
      }
    );

  const isDark = useRecoilValue(isDarkAtom);
  const loading = realPriceLoading || predictPriceLoading;

  const adjustPrices = (prices: number[]): number[] => {
    let lastValidPrice = prices.find((price) => price !== 0) || 0;
    return prices.map((price) => {
      if (price === 0) {
        return lastValidPrice;
      }
      lastValidPrice = price;
      return price;
    });
  };

  const processPriceData = (data: number[], period: string) => {
    const periodLength = period === "7Days" ? 7 : 30;
    const slicedData = data.slice(-periodLength);
    return adjustPrices(slicedData);
  };

  let realPriceData =
    realPriceDataResponse?.data.map((data) => data.realPrice) || [];
  let predictPriceData =
    predictPriceDataResponse?.data.map((data) => data.predictPrice) || [];

  let chartCategories =
    realPriceDataResponse?.data.map((data) => data.date) ||
    predictPriceDataResponse?.data.map((data) => data.predictDate) ||
    [];

  if (selectedPeriod === "7Days" || selectedPeriod === "30Days") {
    realPriceData = processPriceData(realPriceData, selectedPeriod);
    predictPriceData = processPriceData(predictPriceData, selectedPeriod);
    chartCategories = chartCategories.slice(-realPriceData.length);
  } else {
    realPriceData = adjustPrices(realPriceData);
  }

  return (
    <>
      <Helmet>
        <title>{fishName} 가격</title>
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
        <Title>{loading ? "Loading..." : fishName}</Title>

        {loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <ButtonGroup>
              <Button
                onClick={() => setFishCode("0")}
                active={fishCode === "0"}
              >
                활어
              </Button>
              <Button
                onClick={() => setFishCode("1")}
                active={fishCode === "1"}
              >
                선어
              </Button>
              <Button
                onClick={() => setFishCode("2")}
                active={fishCode === "2"}
              >
                냉동
              </Button>
              <Button
                onClick={() => setFishCode("3")}
                active={fishCode === "3"}
              >
                가공
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                onClick={() => setSelectedPeriod("7Days")}
                active={selectedPeriod === "7Days"}
              >
                7 Days
              </Button>
              <Button
                onClick={() => setSelectedPeriod("30Days")}
                active={selectedPeriod === "30Days"}
              >
                30 Days
              </Button>
              <Button
                onClick={() => setSelectedPeriod("180Days")}
                active={selectedPeriod === "180Days"}
              >
                180 Days
              </Button>
            </ButtonGroup>

            {realPriceData.length === 0 && predictPriceData.length === 0 ? (
              <Loader>No data available for the selected period.</Loader>
            ) : (
              <ApexChart
                type="line"
                series={[
                  {
                    name: "RealPrice",
                    data: realPriceData,
                  },
                  {
                    name: "PredictPrice",
                    data: predictPriceData,
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
                    show: true,
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
                  colors: ["#0fbcf9", "#e74c3c"],
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
      <Footer>
        <p>&copy; 2024 수산물 가격 예측. All rights reserved.</p>
      </Footer>
    </>
  );
}

export default Fish;
