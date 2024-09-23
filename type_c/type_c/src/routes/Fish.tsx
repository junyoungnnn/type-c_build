// Fish.tsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchFishRealPrice, fetchFishPredictPrice } from "./api";
import { Helmet } from "react-helmet-async";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { endDateAtom } from "../atom";
import { subMonths, format } from "date-fns"; // date-fns에서 함수 임포트

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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
  margin: 100px 0;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const ErrorMessage = styled.span`
  color: red;
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

interface NewsItem {
  num: string;
  title: string;
  date: string;
  link: string | null;
}

function Fish() {
  const { fishName } = useParams<RouteParams>();
  const [selectedPeriod, setSelectedPeriod] = useState("7Days");
  const [fishCode, setFishCode] = useState("0");
  const [modelName, setModelName] = useState("lstm");
  const endDate = useRecoilValue(endDateAtom);

  // startDate 계산 (date-fns 사용)
  const startDate = useMemo(() => {
    const date = subMonths(new Date(endDate), 6);
    return format(date, "yyyy-MM-dd");
  }, [endDate]);

  // realPrice 데이터 fetching
  const {
    data: realPriceDataResponse,
    isLoading: realPriceLoading,
    error: realPriceError,
  } = useQuery<IRealPriceData, Error>(
    ["realprice", fishName, fishCode, startDate, endDate],
    () => fetchFishRealPrice(fishName, fishCode, startDate, endDate)
  );

  // predictPrice 데이터 fetching
  const {
    data: predictPriceDataResponse,
    isLoading: predictPriceLoading,
    error: predictPriceError,
  } = useQuery<IPredictPriceData, Error>(
    ["predictprice", fishName, fishCode, startDate, endDate, modelName],
    () =>
      fetchFishPredictPrice(fishName, fishCode, startDate, endDate, modelName),
    {
      enabled: true, // 항상 fetch predictPrice 데이터를 가져옴
    }
  );

  const loading = realPriceLoading || predictPriceLoading;
  const error = realPriceError || predictPriceError;

  // 데이터 정렬
  const sortedRealPriceData = realPriceDataResponse?.data
    ? [...realPriceDataResponse.data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : [];

  const sortedPredictPriceData = predictPriceDataResponse?.data
    ? [...predictPriceDataResponse.data].sort(
        (a, b) =>
          new Date(a.predictDate).getTime() - new Date(b.predictDate).getTime()
      )
    : [];

  // 공통 날짜 배열 생성
  const realDates = sortedRealPriceData.map((d) => d.date);
  const predictDates = sortedPredictPriceData.map((d) => d.predictDate);
  const combinedDates = Array.from(
    new Set([...realDates, ...predictDates])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 가격 데이터 매핑
  const realPriceMap = new Map(
    sortedRealPriceData.map((d) => [d.date, d.realPrice])
  );
  const predictPriceMap = new Map(
    sortedPredictPriceData.map((d) => [d.predictDate, d.predictPrice])
  );

  const realPriceDataAligned = combinedDates.map(
    (date) => realPriceMap.get(date) || null
  );
  const predictPriceDataAligned = combinedDates.map(
    (date) => predictPriceMap.get(date) || null
  );

  // 가격 조정 함수 수정
  const adjustPrices = (prices: (number | null)[]): (number | null)[] => {
    let lastValidPrice: number | null = null;
    return prices.map((price) => {
      if (price === null || price === 0) {
        return lastValidPrice;
      }
      lastValidPrice = price;
      return price;
    });
  };

  const adjustedRealPriceData = adjustPrices(realPriceDataAligned);
  const adjustedPredictPriceData = adjustPrices(predictPriceDataAligned);

  // 기간에 따른 데이터 슬라이싱
  const periodLength = useMemo(() => {
    switch (selectedPeriod) {
      case "7Days":
        return 7;
      case "30Days":
        return 30;
      case "180Days":
        return 180;
      default:
        return 7;
    }
  }, [selectedPeriod]);

  const slicedRealPriceData = adjustedRealPriceData.slice(-periodLength);
  const slicedPredictPriceData = adjustedPredictPriceData.slice(-periodLength); // 항상 predictPrice 데이터를 슬라이스
  const slicedCategories = combinedDates.slice(-periodLength);

  return (
    <>
      <Helmet>
        <title>{fishName} 가격</title>
      </Helmet>
      <Container>
        <Title>{loading ? "Loading..." : fishName}</Title>

        {loading ? (
          <Loader>Loading...</Loader>
        ) : error ? (
          <ErrorMessage>Error fetching data: {error.message}</ErrorMessage>
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

            {slicedRealPriceData.length === 0 &&
            slicedPredictPriceData.length === 0 ? (
              <Loader>No data available for the selected period.</Loader>
            ) : (
              <ApexChart
                type="line"
                series={[
                  {
                    name: "RealPrice",
                    data: slicedRealPriceData,
                  },
                  {
                    name: "PredictPrice",
                    data: slicedPredictPriceData,
                  },
                ]}
                options={{
                  theme: {
                    mode: "light",
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
                    width: [5, 5],
                    curve: "straight",
                  },
                  yaxis: {
                    show: true,
                    min: 0, // y축 최소값을 0으로 설정
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
                    categories: slicedCategories,
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
                      formatter: (value: number | null) =>
                        value !== null ? `${value.toFixed(0)}원` : "N/A",
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
