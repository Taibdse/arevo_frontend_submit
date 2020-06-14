import React from "react";
import ReactDOM from "react-dom";
import { data, totalTrackLength } from "./sampleData";
import "./styles.css";

// the height of each segment
const segmentHeight = 12; //px
//the space between rows
const spaceBetweenrows = 4; //px

// row is the one that segments lie in and start from 0
// for example: in the timeSegmentsNums.png, 
// the segment 0-60 is in row 0, segment 240-320 is in row 1; segment 280-410 is in row 2

// assume all data is valid and sorted by start time
const TimelineSegments = ({ data, totalTrackLength }) => {
  
  //sort the segments that have the same start value and their end values are not sorted in ascending; 
  data.sort((a, b) => {
    if(a.start === b.start && a.end < b.end) return -1;
    return 0;
  });

  // [200, 400, 500]: 200 is the max value in row 0
  const maxRowValues = [];

  const renderedData = data.map((item, index) => {
    item.width = (item.end - item.start) / totalTrackLength * 100;
    item.left = item.start / totalTrackLength * 100;

    if(index === 0) {
      item.row = 0;
      maxRowValues.push(item.end);
    } else {
      //find the row for current segment
      for(let i = 0; i < maxRowValues.length; i++){
        const maxValueForRowI = maxRowValues[i];
        if(item.start > maxValueForRowI) {
          item.row = i;
          if(item.end > maxValueForRowI) maxRowValues[i] = item.end;
          break;
        } 
      }
     
      //if the current segment has no row to lie in, start the next row
      if(item.row === undefined || item.row === null){
        item.row = maxRowValues.length;
        maxRowValues.push(item.end);
      }
    }

    item.top = item.row * (segmentHeight + spaceBetweenrows);
    return { ...item };
  })

  const containerHeight = maxRowValues.length * (segmentHeight + spaceBetweenrows) - spaceBetweenrows;

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
