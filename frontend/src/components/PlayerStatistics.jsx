import React, { useState } from 'react';
import { Line, PolarArea, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from "chart.js"; 
import 'chartjs-adapter-date-fns';

ChartJS.register(...registerables);

export default function PlayerStatistics({ type }) {
  const [timeInterval, setTimeInterval] = useState('Day');
  // const totalDuration = 10000;
  // const delayBetweenPoints = totalDuration / data.length;
  const delayBetweenPoints = 200;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
  const animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    }
  };

  // Mock data for ELO Over Time
  const eloData = {
    Day: [1000, 1010, 1025, 1300, 1060, 1100, 1500],
    Month: [1000, 1100, 1050, 1200, 1300, 1400, 1500, 1600, 1200],
    Year: [1000, 1250, 1300, 1400, 1500, 1600, 1700, 1800],
  };

  // Mock data for Wins Over Time
  const winsData = {
    Day: [{ x: '2024-01-01', y: 1 }, { x: '2024-01-02', y: 2 }, { x: '2024-01-03', y: 3 }],
    Month: [{ x: '2024-01', y: 2 }, { x: '2024-02', y: 3 }, { x: '2024-03', y: 5 }],
    Year: [{ x: '2024', y: 12 }, { x: '2025', y: 15 }, { x: '2026', y: 18 }],
  };

  // Chart data based on selected time interval
  const eloChartData = {
    labels: eloData[timeInterval].map((_, index) => `2024-0${index + 1}-01`), // Mock dates
    datasets: [
      {
        label: 'ELO',
        data: eloData[timeInterval],
        borderColor: '#f97316', // Orange color
        backgroundColor: 'rgba(249, 115, 22, 0.5)', // Lighter orange for fill
        fill: true,
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Wins Over Time',
        data: winsData[timeInterval],
        backgroundColor: '#f97316', // Orange color for dots
        borderColor: '#f97316', // Orange color for border
        borderWidth: 1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      {/* Only show time interval buttons for ELO Over Time and Wins Over Time */}
      {(type === 'elo' || type === 'wins') && (
        <div className="mb-4 flex">
          {['Day', 'Month', 'Year'].map((interval) => (
            <button
              key={interval}
              onClick={() => setTimeInterval(interval)}
              className={`mx-2 px-4 py-2 ${
                timeInterval === interval
                  ? 'bg-purple-700 text-white'
                  : 'border border-purple-500 text-purple-500'
              } rounded-lg transition-all duration-200`}
            >
              {interval}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-4">
        {type === 'elo' && (
          <Line
            data={eloChartData}
            options={{
              animation,
              scales: {
                x: {
                  type: 'time',
                  time: { unit: timeInterval.toLowerCase() },
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      size: 18,
                    },
                    color: '#ccc',
                  },
                  grid: { color: '#444' },
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#ccc',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'ELO',
                    font: {
                      size: 18,
                    },
                    color: '#ccc',
                  },
                  grid: { color: '#444' },
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#ccc',
                  },
                },
              },
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
            }}
            height={300}
            width={600}
          />
        )}
        {type === 'playstyle' && (
          <PolarArea
            data={{
              labels: ['Speed', 'Strategy', 'Aggression', 'Defense', 'Efficiency'],
              datasets: [
                {
                  label: 'Playstyle',
                  data: [3, 4, 2, 5, 4],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                r: {
                  grid: { color: '#444' },
                  angleLines: { color: '#444' },
                  ticks: {
                    display: false,
                  },
                  pointLabels: {
                    display: true,
                    font: { size: 18 },
                    color: '#ccc',
                  },
                },
              },
              plugins: {
                tooltip: {
                  enabled: true,
                  backgroundColor: '#fff',
                  titleColor: '#000',
                  bodyColor: '#000',
                  titleFont: { size: 18 },
                  bodyFont: { size: 16 },
                },
                legend: {
                  display: true,
                  labels: {
                    color: '#ccc',
                    font: { size: 15 },
                  }
                },
              },
            }}
            height={300}
            width={600}
          />
        )}
        {type === 'wins' && (
          <Scatter
            data={scatterChartData}
            options={{
              scales: {
                x: {
                  type: 'time',
                  time: { unit: timeInterval.toLowerCase() },
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      size: 18,
                    },
                    color: '#ccc',
                  },
                  grid: { color: '#444' },
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#ccc',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Wins',
                    font: {
                      size: 18,
                    },
                    color: '#ccc',
                  },
                  grid: { color: '#444' },
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#ccc',
                  },
                },
              },
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
            }}
            height={300}
            width={600}
          />
        )}
      </div>
    </div>
  );
}
