import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ yesCount, noCount }) => {
    const data = {
        labels: ['Using Features', 'Not Using'],
        datasets: [
            {
                data: [yesCount, noCount],
                backgroundColor: [
                    '#39B54A', // Tally Green
                    '#EF4444', // Red
                ],
                borderColor: [
                    '#2f9e40',
                    '#db3737',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'white',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                enabled: true
            }
        }
    };

    return <Pie data={data} options={options} />;
};

export default PieChart;
