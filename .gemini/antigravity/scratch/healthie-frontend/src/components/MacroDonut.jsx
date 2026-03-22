import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MacroDonut({ calories = 0, protein_g = 0, carbs_g = 0, fats_g = 0 }) {
  const data = {
    labels: ['Carbs', 'Protein', 'Fats'],
    datasets: [{
      data: [carbs_g * 4, protein_g * 4, fats_g * 9],
      backgroundColor: ['#00d4ff', '#00c98d', '#f5a623'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  const options = {
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(20,21,30,.95)',
        borderColor: 'rgba(255,255,255,.1)',
        borderWidth: 1,
        titleColor: '#f0f0f5',
        bodyColor: '#8a8fa8',
        padding: 12
      }
    },
    animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' }
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
      const width = chart.width, height = chart.height, ctx = chart.ctx;
      ctx.restore();
      ctx.font = `500 22px "JetBrains Mono"`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f0f0f5';
      const text = `${Math.round(calories)}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - 8;
      ctx.fillText(text, textX, textY);
      ctx.font = '400 11px "DM Sans"';
      ctx.fillStyle = '#8a8fa8';
      const subText = 'kcal';
      const subX = Math.round((width - ctx.measureText(subText).width) / 2);
      ctx.fillText(subText, subX, textY + 22);
      ctx.save();
    }
  };

  return (
    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}
