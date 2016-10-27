Plotly.d3.csv('tod_data.csv', function(err, rows){
 var station_types = ['Special District','Suburban Center','Suburban Neighborhood','Town Center','Town Neighborhood','Urban Center', 'Urban Neighborhood'];
 var transit_types = ['SEPTA BSL/MFL','SEPTA NHSL','NJ Transit Northeast Corridor','PATCO','SEPTA Regional Rail','NJ Transit RiverLINE', 'Transit Center (multiple transit lines)','SEPTA Trolley'];

function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var data = transit_types.map(function(transit_type) {
var rowsFiltered = rows.filter(function(row) {
     return (row.transit === transit_type);
  //    return (row.stype === stype);
  });
  return {
      mode: 'markers',
      hoverinfo: 'text',
      name: transit_type,
   //   name: stype,
      x: unpack(rowsFiltered, 'TOD1'),
      y: unpack(rowsFiltered, 'TOD2'),
      text: unpack(rowsFiltered, 'name'),
      marker: {
        size: 10,
        color: unpack(rowsFiltered, 'cc'),
        symbol:unpack(rowsFiltered, 'sym'),
        opacity:1
      }
  };
})

var data2 = station_types.map(function(stype) {
var rowsFiltered = rows.filter(function(row) {
      return (row.stype === stype);
  });
  return {
      mode: 'markers',
      hoverinfo: 'text',
      name: stype,
      x: unpack(rowsFiltered, 'TOD1'),
      y: unpack(rowsFiltered, 'TOD2'),
      text: unpack(rowsFiltered, 'name'),
      marker: {
        size: 10,
        color: unpack(rowsFiltered, 'cc2'),
        symbol:unpack(rowsFiltered, 'sym2'),
        opacity:1
      }
  };
});

var layout = {
  xaxis: {showticklabels :false, title: '',zeroline: true, zerolinecolor: '#969696',zerolinewidth: 4},
  yaxis: {showticklabels:false, title: '', type: 'log',zeroline: true, zerolinecolor: '#969696',zerolinewidth: 4},
  showlegend: false,
  margin: {t: 5,r:5,b:5,l:5},
  hovermode: 'closest',
  shapes: [
    {
      type: 'line',
      x0: 2.57,
      y0: 0,
      x1: 2.57,
      y1: 4,
      line: {
        color: 'rgb(192, 192, 192,.8)',
        width: 2,
        dash: 'dashdot'
      }
    },{
      type: 'line',
      x0: 1,
      y0: 2.2,
      x1: 4.25,
      y1: 2.2,
      line: {
        color: 'rgb(192, 192, 192,.8)',
        width: 2,
         dash: 'dashdot'
      }},{
      type: 'line',
      x0: 1,
      y0: .95,
      x1: 4.25,
      y1: .95,
      line: {
        color: 'rgb(192, 192, 192,.8)',
        width: 2
      }},{
      type: 'line',
      x0: 1,
      y0: .95,
      x1: 1,
      y1: 4.25,
      line: {
        color: 'rgb(192, 192, 192,.8)',
        width: 2
      }
    }

  ]
};
Plotly.plot('tod1-graph', data, layout, {showLink: false, displaylogo: false,displayModeBar: false});
Plotly.plot('tod2-graph', data2, layout, {showLink: false, displaylogo: false,displayModeBar: false});
});