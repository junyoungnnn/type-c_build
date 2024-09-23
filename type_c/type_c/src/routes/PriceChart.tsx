// PriceChart.tsx
import React from "react";
import ApexChart from "react-apexcharts";

interface SeriesData {
  name: string;
  data: (number | null)[];
}

interface PriceChartProps {
  series: SeriesData[];
  categories: string[];
  selectedPeriod: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  series,
  categories,
  selectedPeriod,
}) => {
  return (
    <div style={{ marginBottom: "50px" }}>
      <ApexChart
        type="line"
        series={series}
        options={{
          theme: {
            mode: "light",
          },
          chart: {
            height: 500,
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
                ? "180 Days Chart"
                : selectedPeriod === "30Days"
                ? "30 Days Chart"
                : "7 Days Chart",
            align: "left",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#263238",
            },
          },
          stroke: {
            width: [5, 3, 3, 3], // RealPrice는 두껍게, PredictPrice는 얇게
            curve: "straight",
          },
          yaxis: {
            show: true,
            min: 0, // y축 최소값을 0으로 설정
            title: {
              text: "Price (원)",
              style: {
                color: "#263238",
                fontSize: "12px",
              },
            },
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
            categories: categories,
          },
          fill: {
            type: "gradient",
            gradient: {
              gradientToColors: ["#0be881", "#ff9f43", "#1e90ff", "#e74c3c"],
              stops: [0, 100],
            },
          },
          colors: ["#0fbcf9", "#ff9f43", "#1e90ff", "#e74c3c"], // 각 시리즈별 색상
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
    </div>
  );
};

export default PriceChart;
