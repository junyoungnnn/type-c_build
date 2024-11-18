// PriceChart.tsx

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
  height: 550px; /* 차트 높이를 550px로 증가 */

  @media (max-width: 768px) {
    height: 550px; /* 모바일에서도 높이를 증가 */
  }

  @media (max-width: 480px) {
    height: 350px;
  }
`;

const PriceChart: React.FC<PriceChartProps> = ({
  series,
  categories,
  selectedPeriod,
}) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});

  const generateOptions = (): ApexOptions => {
    const width = window.innerWidth;
    let strokeWidth: number[];
    let titleFontSize: string;
    let axisLabelFontSize: string;
    let xaxisLabelCount: number;
    let xaxisLabelRotation: number = 0; // 레이블 회전 각도

    if (width <= 480) {
      strokeWidth = [1.2, 1.2, 1.2, 1.2];
      titleFontSize = "12px";
      axisLabelFontSize = "8px";
    } else if (width <= 768) {
      strokeWidth = [2, 2, 2, 2];
      titleFontSize = "14px";
      axisLabelFontSize = "10px";
    } else {
      strokeWidth = [3, 3, 3, 3];
      titleFontSize = "16px";
      axisLabelFontSize = "12px";
    }

    // 표시할 레이블 수를 설정
    if (selectedPeriod === "180Days") {
      if (width <= 480) {
        xaxisLabelCount = 15;
      } else if (width <= 768) {
        xaxisLabelCount = 15;
      } else {
        xaxisLabelCount = 15;
      }
    } else if (selectedPeriod === "30Days") {
      if (width <= 480) {
        xaxisLabelCount = 15;
      } else if (width <= 768) {
        xaxisLabelCount = 15;
      } else {
        xaxisLabelCount = 15;
      }
    } else {
      xaxisLabelCount = categories.length; // 7일 차트는 모든 레이블 표시
    }

    // 새로운 categories 배열 생성
    const totalLabels = categories.length;
    const interval = Math.max(1, Math.floor(totalLabels / xaxisLabelCount));
    const displayCategories = categories.map((label, index) => {
      if (index % interval === 0) {
        return label;
      } else {
        return ""; // 빈 문자열로 설정하여 레이블 숨김
      }
    });

    const options: ApexOptions = {
      theme: {
        mode: "light",
      },
      chart: {
        height: "100%",
        width: "100%",
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
            ? "180일 차트"
            : selectedPeriod === "30Days"
            ? "30일 차트"
            : "7일 차트",
        align: "left",
        style: {
          fontSize: titleFontSize,
          fontWeight: "bold",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#263238",
        },
      },
      stroke: {
        width: strokeWidth,
        curve: "straight",
      },
      yaxis: {
        show: true,
        min: 0,
        title: {
          text: "가격 (원)",
          style: {
            color: "#263238",
            fontSize: axisLabelFontSize,
          },
        },
        labels: {
          style: {
            fontSize: axisLabelFontSize,
          },
        },
      },
      xaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        categories: displayCategories, // 수정된 categories 사용
        labels: {
          show: true,
          rotateAlways: true,
          style: {
            colors: "#000000",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: axisLabelFontSize,
          },
        },
      },
      legend: {
        position: "top", // 범례를 차트 상단으로 이동
        horizontalAlign: "right", // 범례를 오른쪽으로 정렬
        offsetY: 0,
      },
      grid: {
        padding: {
          bottom: 50, // 차트 하단 여백을 늘려 x축 레이블과 겹치지 않도록 함
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: ["#0be881", "#ff9f43", "#1e90ff", "#e74c3c"],
          stops: [0, 100],
        },
      },
      colors: ["#0be881", "#ff9f43", "#1e90ff", "#e74c3c"],
      tooltip: {
        x: {
          formatter: (value: number, opts?: any) => {
            // 원래의 categories 배열에서 레이블 가져오기
            return categories[value] || "";
          },
        },
        y: {
          formatter: (value: number | null) =>
            value !== null ? `${value.toFixed(0)}원` : "N/A",
        },
      },
    };

    return options;
  };

  useEffect(() => {
    const updateOptions = () => {
      if (typeof window !== "undefined") {
        const newOptions = generateOptions();
        setChartOptions(newOptions);
      }
    };

    updateOptions(); // 초기 옵션 설정

    window.addEventListener("resize", updateOptions);
    return () => window.removeEventListener("resize", updateOptions);
  }, [selectedPeriod, categories]);

  return (
    <ChartContainer>
      <ApexChart
        type="line"
        series={series}
        options={chartOptions}
        height="100%"
        width="100%"
      />
    </ChartContainer>
  );
};

export default PriceChart;
