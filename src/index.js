import React from "react";
import ReactDOM from "react-dom";
import { data, totalTrackLength } from "./sampleData";
import "./styles.css";

// the height of each segment
const segmentHeight = 12; //px
//the space between levels
const spaceBetweenLevels = 4; //px

// level is the row that segments lie in and start from 0
// for example: in the timeSegmentsNums.png, 
// the segment 0-60 is in level 0, segment 240-320 is in level 1; segment 280-410 is in level 2

// assume all data is valid and sorted by start time
const TimelineSegments = ({ data, totalTrackLength }) => {
  
  // [200, 400, 500] 200 is the max value in level 0
  const maxLevelValues = [];

  const renderedData = data.map((item, index) => {
    item.width = (item.end - item.start) / totalTrackLength * 100;
    item.left = item.start / totalTrackLength * 100;

    if(index === 0) {
      item.level = 0;
      maxLevelValues.push(item.end);
    } else {
      //find the level for current segment
      for(let i = 0; i < maxLevelValues.length; i++){
        const maxValueForLevelI = maxLevelValues[i];
        if(item.start > maxValueForLevelI) {
          item.level = i;
          if(item.end > maxValueForLevelI) maxLevelValues[i] = item.end;
          break;
        } 
      }
     
      //if the current segment has no level to lie in, start the next level
      if(item.level === undefined || item.level === null){
        item.level = maxLevelValues.length;
        maxLevelValues.push(item.end);
      }
    }

    item.top = item.level * (segmentHeight + spaceBetweenLevels);
    return { ...item };
  })

  const containerHeight = maxLevelValues.length * (segmentHeight + spaceBetweenLevels) - spaceBetweenLevels;

  return <div className="container" style={{ height: containerHeight + 'px' }}>
    {renderedData.map(item => (
      <div 
        key={item.id}
        className="segment" 
        style={{ 
          width: item.width + '%', 
          left: item.left + '%', 
          top: item.top + 'px'  
        }}>
          <span className="start">{item.start}</span>
          <span className="end">{item.end}</span>
      </div>
    ))}
  </div>;
};

// boilerplate
ReactDOM.render(
  <TimelineSegments data={data} totalTrackLength={totalTrackLength} />,
  document.getElementById("root")
);
