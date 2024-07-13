import React, { useState, useEffect } from 'react';
import '../style-css/style-graph.css';
import AnalyticsBarChart from './Graph_Component/AnalyticsBarChart';
import AnalyticsPieCharts from './Graph_Component/AnalyticsPieChart';

const Analytics = ()=>{

    return (
        <>
      <div class="text">Analytics</div>
      <div style={{display:"flex"}}>
      <div className="my-card" style={{width:'60%'}}>
          <AnalyticsBarChart/>
      </div>
      <div className="my-card">
        <AnalyticsPieCharts/>
      </div>
      </div>
      </>
    );
}

export default Analytics;