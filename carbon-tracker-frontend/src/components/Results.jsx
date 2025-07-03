import React from 'react';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Results = ({ result, theme }) => {
  const isDark = theme === 'dark';

  const labels = Object.keys(result.emissions);
  const values = Object.values(result.emissions);

  const chartData = {
    labels,
    datasets: [{
      label: 'kg CO₂ / month',
      data: values,
      backgroundColor: isDark
        ? 'rgba(0, 230, 118, 0.7)'
        : 'rgba(0, 150, 136, 0.6)',
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 30
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#f9f9f9' : '#222',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#333' : '#fff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#eee' : '#000'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sources of Emission',
          color: isDark ? '#ddd' : '#333',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          color: isDark ? '#ccc' : '#333',
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'kg CO₂ / month',
          color: isDark ? '#ddd' : '#333',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          color: isDark ? '#ccc' : '#333',
          font: { size: 12 }
        },
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        }
      }
    }
  };

  const generateSummary = (total) => {
    if (total < 100) {
      return "✅ Fantastic! Your carbon footprint is very low — you're living sustainably.";
    } else if (total < 300) {
      return "🙂 You're doing fairly well! With a few small lifestyle tweaks, you could reach eco-excellence.";
    } else {
      return "⚠️ Your carbon footprint is on the higher side. But don't worry — smart choices ahead can make a big difference.";
    }
  };

  const generateKudos = (emissions) => {
    const kudos = [];

    if (emissions.Car < 20) kudos.push("🚗 Excellent control on car usage!");
    if (emissions.Bike < 5) kudos.push("🏍 Minimal bike travel — great job!");
    if (emissions.Bus < 10) kudos.push("🚌 Responsible bus usage!");
    if (emissions.Train < 5) kudos.push("🚆 Very low train travel!");
    if (emissions.Flights < 20) kudos.push("✈️ Rare air travel — awesome!");
    if (emissions.Electricity < 80) kudos.push("💡 Efficient energy usage!");
    if (emissions.Lpg < 25) kudos.push("🔥 Great conservation of LPG!");
    if (emissions.Cigarettes < 1) kudos.push("🚭 Avoiding cigarettes — amazing!");
    if (emissions.Plastic < 0.5) kudos.push("🧴 Very low plastic usage!");

    return kudos;
  };

  const generateTips = (emissions) => {
    const tips = [];

    if (emissions.Car > 38.4) tips.push("🚗 Reduce car use with public transport.");
    if (emissions.Bike > 7.0) tips.push("🏍 Replace bike trips with cycling.");
    if (emissions.Bus > 15.75) tips.push("🚌 Combine errands to reduce bus travel.");
    if (emissions.Train > 10.25) tips.push("🚆 Cut down unnecessary train travel.");
    if (emissions.Flights > 45) tips.push("✈️ Offset flight emissions by planting trees.");
    if (emissions.Electricity > 123) tips.push("💡 Use energy-efficient appliances.");
    if (emissions.Lpg > 44.7) tips.push("🔥 Try induction cooktops or solar.");
    if (emissions.Cigarettes > 1.26) tips.push("🚭 Reduce smoking — it's eco-friendly.");
    if (emissions.Plastic > 0.828) tips.push("🧴 Use reusable bottles & bags.");

    tips.push("🌳 Plant more trees to offset your emissions.");

    if (tips.length === 1)
      tips.push("🎉 You're already doing great — keep going!");

    return tips;
  };

  const summaryText = generateSummary(result.total);
  const kudosList = generateKudos(result.emissions);
  const tipsList = generateTips(result.emissions);
  const yearlyTotal = (result.total * 12).toFixed(2);
  const treesRequired = Math.ceil(yearlyTotal / 21.77);

  const renderCombinedCharts = () => (
    <div id="combined-charts" style={{ width: '700px', backgroundColor: isDark ? '#1e1e1e' : '#fff', padding: '20px' }}>
      <h3 style={{ color: isDark ? '#ccc' : '#333', textAlign: 'center' }}>📊 Monthly vs Yearly Comparison</h3>
      <div style={{ height: '260px', marginBottom: '30px' }}>
        <Bar
          data={{
            labels: ['Monthly Footprint', 'Yearly Projection'],
            datasets: [{
              label: 'kg CO₂',
              data: [result.total, yearlyTotal],
              backgroundColor: [
                isDark ? 'rgba(0, 230, 118, 0.7)' : '#00a86b',
                isDark ? 'rgba(255, 99, 132, 0.7)' : '#ff4d4f'
              ],
              borderRadius: 6
            }]
          }}
          options={chartOptions}
        />
      </div>
      <h3 style={{ color: isDark ? '#ccc' : '#333', textAlign: 'center' }}>📊 Emissions Breakdown</h3>
      <div style={{ height: '260px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
const downloadPDF = () => {
  const downloadButton = document.getElementById('download-button');
  downloadButton.disabled = true;
  downloadButton.innerText = "⏳ Preparing Report...";

  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'fixed';
  tempDiv.style.top = '-10000px';
  tempDiv.style.left = '-10000px';
  document.body.appendChild(tempDiv);

  import('react-dom/client').then(ReactDOM => {
    const root = ReactDOM.createRoot(tempDiv);
    root.render(renderCombinedCharts()); // Chart WITH headings

    // Wait for chart to finish rendering
    setTimeout(() => {
      html2canvas(tempDiv, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Clone the original report
        // Clone the original report
const originalReport = document.getElementById('report');
const report = originalReport.cloneNode(true);

// ❌ Remove the download button from the clone
const downloadBtn = report.querySelector('#download-button');
if (downloadBtn) {
  downloadBtn.parentNode.removeChild(downloadBtn);
}


        // ❌ Remove the original (blank) chart section from the clone
        const oldCharts = report.querySelector('#chart-canvas-wrapper');
        if (oldCharts) oldCharts.remove();

        // ✅ Add the captured image with chart + headings
        const imageEl = document.createElement('img');
        imageEl.src = imgData;
        imageEl.style.width = '100%';
        imageEl.style.margin = '24px 0';
        report.appendChild(imageEl);

        const opt = {
          margin: 0.5,
          filename: 'carbon_footprint_report.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf()
          .set(opt)
          .from(report)
          .save()
          .then(() => {
            root.unmount();
            document.body.removeChild(tempDiv);
            downloadButton.disabled = false;
            downloadButton.innerText = "📄 Download Full PDF Report";
          });
      }).catch(err => {
        console.error("PDF generation error:", err);
        root.unmount();
        document.body.removeChild(tempDiv);
        alert("Failed to generate PDF.");
        downloadButton.disabled = false;
        downloadButton.innerText = "📄 Download Full PDF Report";
      });
    }, 800); // Allow chart render time
  });
};


  return (
    <div id="report" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #00a86b', paddingBottom: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Inventra_logo.jpeg" alt="INVENTRA Logo" style={{ height: '40px', marginRight: '12px' }} />
          <h2 style={{ margin: 0, color: isDark ? '#f9f9f9' : '#222' }}>INVENTRA</h2>
        </div>
        <span style={{ fontSize: '12px', color: 'gray' }}>
          Report generated on {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Total */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        🌍 Total: <span style={{ color: '#00a86b' }}>{result.total} kg CO₂ / month</span>
      </h2>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '8px' }}>
        📆 Yearly Estimate: <strong>{yearlyTotal} kg CO₂ / year</strong>
      </p>

      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 24px', color: isDark ? '#ccc' : '#444', lineHeight: '1.6' }}>
        <p style={{ fontSize: '0.95rem' }}>That’s approximately equal to:</p>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.95rem' }}>
          <li>🚗 Driving a car for <strong>{(yearlyTotal / 0.192).toFixed(0)} km</strong></li>
          <li>🔥 Burning <strong>{(yearlyTotal / 2.983).toFixed(0)} kg</strong> of LPG</li>
        </ul>
        <p style={{ fontSize: '1.05rem', marginTop: '12px', fontWeight: '600', color: '#00a86b' }}>
          🌳 You’d need to plant around <strong>{treesRequired}</strong> trees per year to offset this.
        </p>
      </div>

      {/* 📥 Download Button */}
     <div className="screen-only" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
  <button
    id="download-button"
    onClick={downloadPDF}
    style={{
      padding: '10px 18px',
      fontSize: '0.95rem',
      borderRadius: '6px',
      backgroundColor: '#00a86b',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}
  >
    📄 Download Full PDF Report
  </button>
</div>

      {/* Summary & Tips */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: isDark ? '#ccc' : '#333' }}>📄 Summary</h3>
        <p>{summaryText}</p>

        {kudosList.length > 0 && (
          <>
            <h3 style={{ color: isDark ? '#ccc' : '#333' }}>🏅 Extra Kudos</h3>
            <ul>{kudosList.map((k, i) => <li key={i}>{k}</li>)}</ul>
          </>
        )}

        <h3 style={{ color: isDark ? '#ccc' : '#333' }}>💡 Eco Tips</h3>
        <ul>{tipsList.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>

      {/* Chart Section (page break in PDF) */}
      <div className="page-break" style={{ pageBreakBefore: 'always', padding: '24px 12px' }}>
        {/* Charts for screen only */}
      <div className="screen-only" id="chart-canvas-wrapper">
  <div style={{ height: '260px', marginBottom: '40px' }}>
    <Bar
      data={{
        labels: ['Monthly Footprint', 'Yearly Projection'],
        datasets: [{
          label: 'kg CO₂',
          data: [result.total, yearlyTotal],
          backgroundColor: [
            isDark ? 'rgba(0, 230, 118, 0.7)' : '#00a86b',
            isDark ? 'rgba(255, 99, 132, 0.7)' : '#ff4d4f'
          ],
          borderRadius: 6
        }]
      }}
      options={chartOptions}
    />
  </div>
  <div style={{ height: '260px' }}>
    <Bar data={chartData} options={chartOptions} />
  </div>
</div>

        {/* PDF only image chart */}
  

      </div>
    </div>
  );
};

export default Results;
