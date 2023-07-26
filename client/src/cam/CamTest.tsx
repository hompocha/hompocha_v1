import { useState } from 'react';
import UserVideoComponent from './UserVideoComponent';
import styles from './CamTest.module.css';
// interface CamTwoProps {
//   state: any; // 적절한 타입으로 수정하세요.
//   num: number;
//   members: string[]; // 적절한 타입으로 수정하세요.
// }

// const CamTest: React.FC<CamTwoProps> = ({ state, num, members }) => {
const CamTest = (props:any) => {
  interface Props {
    index: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    num : number;
  }
  
  const CamSlice: React.FC<Props> = ({ index, radius, startAngle, endAngle, num}) => {
    const cx = radius;
    const cy = radius;

    const mode = props.user.mode;
    const publisher = props.user.getStreamManager();
    const subscribers = props.user.getSubscriber();
    const members = [publisher, ...subscribers];

    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const pathData = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
    
    const sliceStyle = {
      fill: 'tomato',
      stroke: 'black',
      strokeWidth: '3px',
    };

    const videoClipId = `fan-clip-${index}`;

    return (
      <g>
          <foreignObject width="100%" height="100%" clipPath={`url(#${videoClipId})`}>
            <UserVideoComponent streamManager={members[index]} index = {index} num = {num} mode ={mode} />
          </foreignObject>
          <clipPath key={videoClipId} id={videoClipId}>
            <path d={pathData} />;
          </clipPath>
      </g>
    );
  };

  const renderCamSlices = () => {
    const num = props.user.getSubscriber().length + 1;
    const angle = 360 / num - 0.01;
    const pieSlices = [];

    for (let i = 0; i < num; i++) {
      const startAngle = angle * i;
      const endAngle = startAngle + angle;
      pieSlices.push(
        <CamSlice key={i} index={i} radius={350} startAngle={startAngle} endAngle={endAngle} num = {num}/>
      );
    }
    return pieSlices;
  };

  return (
    <div>
      <div>
        {/* <input
          min={1}
          max={6}
          type="number"
          placeholder="현재 유저의 수"
          value={num}
          onChange={(e) => setNum(Number(e.target.value))}
        /> */}
      </div>
      <svg className={styles.position} width={1000} height={1000}>{renderCamSlices()}</svg>
    </div>
  );
}

export default CamTest;
