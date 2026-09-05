import './Skeleton.css';

export function Skeleton() {
  return (
    <div className="dashboard-container skeleton-layout">
      <aside className="left-sidebar">
        <div className="skeleton avatar-skel" />
        <div className="skeleton text-skel title-skel" />
        <div className="skeleton text-skel body-skel" />
      </aside>
      <section className="main-content">
        <div className="skeleton text-skel title-skel" />
        <div className="metrics-row">
          <div className="skeleton card-skel" />
          <div className="skeleton card-skel" />
          <div className="skeleton card-skel" />
        </div>
        <div className="repo-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton card-skel" />
          ))}
        </div>
      </section>
    </div>
  );
}
