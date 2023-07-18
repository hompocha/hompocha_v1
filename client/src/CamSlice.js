import "./Cam.css";

function CamSlice({ radius, startAngle, endAngle }) {
  const cx = radius;
  const cy = radius;

  const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
  const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startAngleRad);
  const y1 = cy + radius * Math.sin(startAngleRad);
  const x2 = cx + radius * Math.cos(endAngleRad);
  const y2 = cy + radius * Math.sin(endAngleRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const pathData = `
    M ${cx} ${cy}
    L ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    Z
  `;

  const sliceStyle = {
    stroke: "black",
    strokeWidth: "3px",
    fill: "transparent",
    overflow: "hidden",
  };

  return <path d={pathData} style={sliceStyle} />;
}

export default CamSlice;
