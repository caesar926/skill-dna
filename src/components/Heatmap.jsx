import './Heatmap.css';

export function Heatmap ({contributionData}) {
  if (!contributionData) return null
  return(
     <section className="heatmap-container">
          <header className="heatmap-header">
            <h3>Contribution Graph</h3>
            <span>{contributionData.totalContributions} total contributions</span>
          </header>
          <div className="heatmap-wrapper">
            <div className="heatmap-grid">
              {contributionData.weeks.map((week, wi) => (
                <div key={wi} className="heatmap-week">
                  {week.contributionDays.map((day) => {
                    const count = day.contributionCount;
                    const level = count === 0 ? 0 : count < 4 ? 1 : count < 8 ? 2 : count < 12 ? 3 : 4;
                    return (
                      <div
                        key={day.date}
                        className="heatmap-day"
                        data-level={level}
                        title={`${day.date}: ${count} contributions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
  )
}

export default Heatmap