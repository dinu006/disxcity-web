function SelectionCard({
  title,
  subtitle,
  count,
  onClick,
}) {
  return (
    <button
      className="selection-card"
      onClick={onClick}
    >
      <div>
        <span className="selection-subtitle">
          {subtitle}
        </span>

        <h2>{title}</h2>

        {count !== undefined && (
          <span className="selection-count">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <span className="selection-arrow">
        →
      </span>
    </button>
  );
}

export default SelectionCard;