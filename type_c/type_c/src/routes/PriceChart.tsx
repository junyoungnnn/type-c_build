import React, { useState, useEffect } from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { ApexOptions } from "apexcharts";

interface SeriesData {
  name: string;
  data: (number | null)[];
}

interface PriceChartProps {
  series: SeriesData[];
  categories: string[];
  selectedPeriod: string;
}

const ChartContainer = styled.div`
  margin-bottom: 50px;
  width: 100%;
  height: 550px;

  @media (max-width: 768px) {
    height: 450px; /* 태블릿 환경 */
  }

  @media (max-width: 480px) {
    height: 300px; /* 모바일 환경 */
    padding: 10px; /* 모바일 환경에서 여백 추가 */
  }
`;

const PriceChart: React.FC<PriceChartProps> = ({
  series,
  categories,
  selectedPeriod,
}) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});

  const generateOptions = (): ApexOptions => ({
    chart: {
      height: "100%",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      tickAmount:
        selectedPeriod === "180Days"
          ? 13 // 180일에서는 12개만 표시
          : selectedPeriod === "30Days"
          ? 10 // 30일에서 10개만 표시
          : categories.length - 1, // 기본 설정
      labels: {
        rotate: -45, // 모바일 환경에서는 45도 회전
        style: {
          fontSize: window.innerWidth <= 480 ? "10px" : "12px", // 모바일에서는 글꼴 크기 축소
        },
      },
    },
    stroke: {
      width: 3,
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    colors: ["#0be881", "#ff9f43", "#1e90ff", "#e74c3c"],
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "10px",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          xaxis: {
            tickAmount:
              selectedPeriod === "180Days"
                ? 12 // 모바일 환경에서도 180일에서 12개만 표시
                : selectedPeriod === "30Days"
                ? 10
                : undefined,
            labels: { style: { fontSize: "10px" }, rotate: -45 }, // 좁은 화면에서 회전
          },
        },
      },
    ],
  });

  useEffect(() => {
    setChartOptions(generateOptions());
  }, [categories, selectedPeriod]);

  return (
    <ChartContainer>
      <ApexChart
        type="line"
        series={series}
        options={chartOptions}
        height="100%"
        width="100%" // 추가
      />
    </ChartContainer>
  );
};

export default PriceChart;
