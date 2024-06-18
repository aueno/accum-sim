import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Fillerを追加
} from 'chart.js';

import { atom, useAtom } from "jotai";
import { 
    InvprincipalCalcAtom,
    InvtotalCalcAtom,
 } from "./InvCalc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Fillerを登録
);

const InvGraph = () => {
  const [Invprincipalcalc] = useAtom(InvprincipalCalcAtom);
  const [InvtotalCalc] = useAtom(InvtotalCalcAtom);
  const months = (InvtotalCalc.length + 1);
  const x = new Array();
  const y1 = new Array();
  const y2 = new Array();
  const setuzei = Math.floor((InvtotalCalc[InvtotalCalc.length-1] - Invprincipalcalc[Invprincipalcalc.length-1]) * 0.20315);
  let j = 1;
  for (let i = 1; i <= months; i++) {
    if (i % 12 === 0) {
      x.push(j);
      y1.push(Invprincipalcalc[i]);
      y2.push(InvtotalCalc[i]);
      j++;
    }
  }
  const graphData = {
    labels: x,
    datasets: [
      {
        label: "投資元本（万円）",
        data: y1,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        stack: "1",
        fill: 'origin',
      },
      {
        label: "運用総額（万円）",
        data: y2,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        stack: "1",
        fill: '-1',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px",
    width: "100%",
  };

  const chartStyle = {
    width: "700px",
    height: "300px",
  };

  return (
    <div>
      <div className="App" style={divStyle}>
        <div style={chartStyle}>
          <Line
            data={graphData}
            options={options}
            id="unyo-graph"
          />
        </div>
      </div>
    </div>
  );
}

export { InvGraph };
