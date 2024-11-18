// Fish.tsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useQueries } from "react-query";
import { fetchFishRealPrice, fetchFishPredictPrice } from "./api";
import { Helmet } from "react-helmet-async";
import { useRecoilValue } from "recoil";
import { endDateAtom } from "../atom";
import { subMonths, format, subDays } from "date-fns";
import PriceChart from "./PriceChart";

// 스타일드 컴포넌트 임포트
import {
  Container,
  Title,
  Loader,
  ErrorMessage,
  ButtonGroup,
  Button,
} from "./FishStyles";

const TodayPricesContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: ${(props) => props.theme.white.darker};
  border-radius: 10px;

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const PriceItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  color: ${(props) => props.theme.black.veryDark};
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 반응형 스타일 */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
  }
`;

const ModelName = styled.span`
  font-weight: bold;

  /* 반응형 스타일 */
  @media (max-width: 480px) {
    margin-bottom: 5px;
  }
`;

const PriceValue = styled.span`
  color: ${(props) => props.theme.black.darker};
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

interface SeriesData {
  name: string;
  data: (number | null)[];
}

function Fish() {
  const { fishName } = useParams<RouteParams>();

  // 물고기별 사용 가능한 fishCode 맵핑
  const fishAvailableCodes: { [key: string]: string[] } = {
    가자미: ["0"], // 활어
    갈치: ["1"], // 선어
    고등어: ["1"],
    대구: ["1"],
    돔: ["0"],
    방어: ["0"],
    삼치: ["1"],
    우럭: ["0"],
    장어: ["1"],
    전갱이: ["1"],
    // 필요한 경우 다른 물고기도 추가
  };

  const fishCodeLabels: { [key: string]: string } = {
    "0": "활어",
    "1": "선어",
    "2": "냉동",
    "3": "가공",
  };

  // fishName에 따른 기본 fishCode 설정
  const defaultFishCode = fishAvailableCodes[fishName]?.[0] || "0";
  const [fishCode, setFishCode] = useState(defaultFishCode);
  const [selectedPeriod, setSelectedPeriod] = useState("7Days");
  const endDate = useRecoilValue(endDateAtom);

  // 시작 날짜 계산 (6개월 전)
  const startDate = useMemo(() => {
    const date = subMonths(new Date(endDate), 6);
    return format(date, "yyyy-MM-dd");
  }, [endDate]);

  // 실제 가격 데이터 페칭 (변경 없음)
  const {
    data: realPriceDataResponse,
    isLoading: realPriceLoading,
    error: realPriceError,
  } = useQuery<IRealPriceData, Error>(
    ["realprice", fishName, fishCode, startDate, endDate],
    () => fetchFishRealPrice(fishName, fishCode, startDate, endDate),
    {
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 10, // 10분
    }
  );

  // 예측 모델 리스트 정의
  const models = ["linear", "transformer", "lstm"];

  // 여러 모델에 대한 예측 가격 데이터 페칭
  const predictPriceQueries = useQueries(
    models.map((model) => ({
      queryKey: ["predictprice", fishName, fishCode, startDate, endDate, model],
      queryFn: () =>
        fetchFishPredictPrice(fishName, fishCode, startDate, endDate, model),
      enabled: true,
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 10, // 10분
    }))
  );

  // 모든 예측 가격 쿼리의 로딩 및 에러 상태
  const predictPriceLoading = predictPriceQueries.some(
    (query) => query.isLoading
  );
  const predictPriceError = predictPriceQueries.find(
    (query) => query.isError
  )?.error;

  // 전체 로딩 및 에러 상태
  const loading = realPriceLoading || predictPriceLoading;
  const error = realPriceError || predictPriceError;

  // 실제 가격 데이터 정렬
  const sortedRealPriceData = realPriceDataResponse?.data
    ? [...realPriceDataResponse.data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : [];

  // 각 모델별 예측 가격 데이터 정렬
  const sortedPredictPriceData: { [key: string]: IPredictData[] } = {};
  predictPriceQueries.forEach((query, index) => {
    const model = models[index];
    if (query.data?.data) {
      sortedPredictPriceData[model] = [...query.data.data].sort(
        (a, b) =>
          new Date(a.predictDate).getTime() - new Date(b.predictDate).getTime()
      );
    } else {
      sortedPredictPriceData[model] = [];
    }
  });

  // 공통 날짜 배열 생성
  const realDates = sortedRealPriceData.map((d) => d.date);
  const predictDates = models.flatMap((model) =>
    sortedPredictPriceData[model].map((d) => d.predictDate)
  );
  const combinedDates = Array.from(
    new Set([...realDates, ...predictDates])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 가격 데이터 매핑
  const realPriceMap = new Map(
    sortedRealPriceData.map((d) => [d.date, d.realPrice])
  );

  const predictPriceMaps: { [key: string]: Map<string, number> } = {};
  models.forEach((model) => {
    predictPriceMaps[model] = new Map(
      sortedPredictPriceData[model].map((d) => [d.predictDate, d.predictPrice])
    );
  });

  const realPriceDataAligned = combinedDates.map(
    (date) => realPriceMap.get(date) || null
  );

  const predictPriceDataAligned: { [key: string]: (number | null)[] } = {};
  models.forEach((model) => {
    predictPriceDataAligned[model] = combinedDates.map(
      (date) => predictPriceMaps[model].get(date) || null
    );
  });

  // 가격 조정 함수
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

  const adjustedPredictPriceData: { [key: string]: (number | null)[] } = {};
  models.forEach((model) => {
    adjustedPredictPriceData[model] = adjustPrices(
      predictPriceDataAligned[model]
    );
  });

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
  const slicedCategories = combinedDates.slice(-periodLength);

  // 각 모델별 데이터 슬라이싱
  const slicedPredictPriceData: { [key: string]: (number | null)[] } = {};
  models.forEach((model) => {
    slicedPredictPriceData[model] = adjustedPredictPriceData[model].slice(
      -periodLength
    );
  });

  // 시리즈 데이터 준비
  const series: SeriesData[] = [
    {
      name: "RealPrice",
      data: slicedRealPriceData,
    },
    ...models.map((model) => ({
      name: `${model.charAt(0).toUpperCase() + model.slice(1)} PredictPrice`,
      data: slicedPredictPriceData[model],
    })),
  ];

  // 모든 시리즈의 값들이 같은 경우 처리
  for (let index = 0; index < series.length; index++) {
    const firstSeries = series[index];
    const dataArray = firstSeries.data;

    const firstValue = dataArray[0];

    const allValuesIdentical = dataArray.every((value) => value === firstValue);

    if (allValuesIdentical) {
      if (series[index].data.length > 2 && series[index].data[2] !== null) {
        series[index].data[2] = (series[index].data[2] as number) + 1;
      }
    }
  }

  // 오늘의 모델별 가격 추출 수정
  // 오늘 날짜 계산
  const today = format(new Date(endDate), "yyyy-MM-dd");

  // 오늘의 모델별 가격 추출 (데이터가 없는 경우 전날의 가격을 가져옴)
  const todayPrices: { [key: string]: { price: number; date: string } | null } =
    {};

  models.forEach((model) => {
    const modelData = sortedPredictPriceData[model];

    // 오늘부터 최대 7일 전까지 탐색
    let dateToCheck = new Date(endDate);
    let foundData = null;

    for (let i = 0; i < 7; i++) {
      const dateString = format(dateToCheck, "yyyy-MM-dd");
      const data = modelData.find((d) => d.predictDate === dateString);
      if (data) {
        foundData = { price: data.predictPrice, date: dateString };
        break;
      }
      // 하루 전으로 이동
      dateToCheck = subDays(dateToCheck, 1);
    }

    todayPrices[model] = foundData;
  });

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
          <ErrorMessage>Error fetching data</ErrorMessage>
        ) : (
          <>
            <ButtonGroup>
              {Object.entries(fishCodeLabels).map(([code, label]) => (
                <Button
                  key={code}
                  onClick={() => setFishCode(code)}
                  active={fishCode === code}
                  disabled={!fishAvailableCodes[fishName]?.includes(code)}
                >
                  {label}
                </Button>
              ))}
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
            models.every(
              (model) => slicedPredictPriceData[model].length === 0
            ) ? (
              <Loader>No data available for the selected period.</Loader>
            ) : (
              <>
                <PriceChart
                  series={series}
                  categories={slicedCategories}
                  selectedPeriod={selectedPeriod}
                />
                {/* 오늘의 모델별 가격 표시 */}
                <TodayPricesContainer>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    오늘의 가격 예측
                  </h2>
                  {models.map((model) => (
                    <PriceItem key={model}>
                      <ModelName>
                        {model.charAt(0).toUpperCase() + model.slice(1)} 모델
                      </ModelName>
                      <PriceValue>
                        {todayPrices[model]
                          ? `${todayPrices[
                              model
                            ]?.price.toLocaleString()} 원 (${
                              todayPrices[model]?.date
                            })`
                          : "데이터 없음"}
                      </PriceValue>
                    </PriceItem>
                  ))}
                </TodayPricesContainer>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default Fish;
