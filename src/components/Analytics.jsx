import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './Analytics.css';

export function Analytics({ languageCounts, total }) {
  if (!total) return null;

  const colors = ['#257bf4', '#2ca750', '#707d93', '#3DDC97'];
 
  const chartData = Object.entries(languageCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="analytics-card">
      <h3 className="card-title">Technology Footprint</h3>
     
      <div className="chart-wrapper">
        <PieChart width={220} height={220}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              color: 'var(--text-main)'
            }}
          />
        </PieChart>
      </div>

      <div className="legend-list">
        {Object.entries(languageCounts).map(([language, count], index) => {
          const percent = Math.round((count / total) * 100);
          return (
            <div key={language} className="legend-item">
              <div className="legend-left">
                <span
                  className="legend-indicator"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-name">{language}</span>
              </div>
              <span className="legend-percentage">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Analytics;