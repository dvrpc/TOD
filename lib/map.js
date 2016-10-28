// required variables DO NOT REMOVE
var props, header, content, titleName, headerClass;
var map;
//declare boundary of region
var oLat = 39.97, oLng = -75.16, zLevel = 10;  

var stationSearch = [];

$(document).ready(function() {
});

function highlightRow(e){
    $("tr").css('background-color', 'white');
    $(this).css('background-color','rgba(0, 255, 255, 0.6)');
}

$('#mapdata-btn').click(function (e) {
  e.preventDefault()
  $('.cat-desc').hide();
  $('.btn-group a[href="#mapdata-main"]').tab('show') // Select tab by name
});

$('#mapchart-btn').click(function (e) {
  e.preventDefault()
    $('.cat-desc').show();
  $('.btn-group a[href="#mapchart-main"]').tab('show') // Select tab by name
});

$('#mapdata2-btn').click(function (e) {
  e.preventDefault()
  $('.btn-group a[href="#mapdata2-main"]').tab('show') // Select tab by name
});

$('#mapchart2-btn').click(function (e) {
  e.preventDefault()
  $('.btn-group a[href="#mapchart2-main"]').tab('show') // Select tab by name
});

$('#chart2-btn').click(function (e) {
  e.preventDefault()
  $('.btn-group a[href="#chart-station"]').tab('show') // Select tab by name
});

$('#chart1-btn').click(function (e) {
  e.preventDefault()
  $('.btn-group a[href="#chart-transit"]').tab('show') // Select tab by name
});

$('#radio1').click(function (e) {
  $('.btn-group a[href="#chart-transit"]').tab('show') // Select tab by name
});

$('#radio2').click(function (e) {
  $('.btn-group a[href="#chart-station"]').tab('show') // Select tab by name
});

$('.nav-tabs li a').click( function(e) {
    history.pushState( null, null, $(this).attr('href') );
});

//$("#legend-btn").click(function() {
//    $("#legendModal").modal("show");
//    $(".navbar-collapse.in").collapse("hide");
//    return false;
//});
        
//declare basemaps
 $.getJSON('data/tod.js', function(data) {
        stations.addData(data);
        map.addLayer(stationsLayer);
    });

    styleOptions = {
      radius: 7,
      weight: 0,
      opacity: 1,
      fillOpacity: 0.7
    };
    var stationsLayer = L.geoJson(null);
    var stations = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, styleOptions);
        },
         style: function(feature){
         switch (feature.properties.QUAD) {
         case 'aboveabove' : return {fillColor: "#046f9e"};
         case 'abovebelow' : return {fillColor: "#24abe2"};
         case 'belowabove' : return {fillColor: "#24abe2"};  
         case 'belowbelow' : return {fillColor: "#77c9ed"};  
        }
    },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindLabel(feature.properties.Station_Na, {
                    className: 'leaflet-label'
                });
                layer.on({click: identify});
                layer.on({click: populatebarchart});
        }      
    }
    });

var rail = L.geoJson(null, {
style: {
    color: 'rgb(200,200,200)',
    weight: 6,
    fill: false,
    clickable: false
}
});
$.getJSON("data/dvrpc_rail.js", function(data) {
rail.addData(data);
});

var DVRPC = L.geoJson(null, {
    style: {
        color: 'rgb(140,140,140)',
        weight: 3,
        fill: false,
        clickable: false
    }
});
$.getJSON("data/cnty.js", function(data) {
    DVRPC.addData(data);
});        

// Basemap Layers
// var mapbox = L.tileLayer.provider('MapBox.crvanpollard.hghkafl4');
var mapbox = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

var Mapbox_Imagery = L.tileLayer(
    'https://api.mapbox.com/styles/v1/crvanpollard/cimpi6q3l00geahm71yhzxjek/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

//create map instance
var map = L.map("mapDIV", {
    minZoom: zLevel,
    zoomControl: false,
    layers: [mapbox, rail, DVRPC,stations]
}).setView([oLat, oLng],zLevel);


//add Layer Control to map
var baseLayers = {
    "Satellite": Mapbox_Imagery,      
    "Street Map": mapbox
};
 L.control.layers(baseLayers).addTo(map);

    L.Control.MapLegend = L.Control.extend({
        options: {
            position: 'bottomleft',
        },
        onAdd: function (map) {
            //TODO: Probably should throw all this data in a class and just loop through it all
            var legendDiv = L.DomUtil.create('div', 'map-legend legend-control leaflet-bar');

            legendDiv.innerHTML += '<div id="legend-icon" title="Toggle Legend"><i class="glyphicon glyphicon-minus"></i><span class="legend-label" style="display:none;">&nbsp;&nbsp;Legend</span></div>';

            var legend_top = L.DomUtil.create('div', 'map-legend-items legend-top', legendDiv),
                legend_body = L.DomUtil.create('div', 'map-legend-items legend-body', legendDiv),
                legend_bottom = L.DomUtil.create('div', 'map-legend-items legend-bottom', legendDiv);

            legend_body.innerHTML += '<div id="legend-content" class="row"><div class="col-xs-4"><i class="fa fa-circle ct-existing"></i>&nbsp;&nbsp;Above</div><div class="col-xs-4"><i class="fa fa-circle  ct-inprogress"></i>&nbsp;&nbsp;Average</div><div class="col-xs-4"><i class="fa fa-circle  ct-planned"></i><span>&nbsp;&nbsp;Below</span></div></div>';
            
            legend_top.innerHTML += '<p><b>Station Scoring</b>'
            
            legendDiv.setAttribute('data-status', 'open');

            return legendDiv;
        }
    });

var mapLegend = new L.Control.MapLegend();
map.addControl(mapLegend);
// Typeahead
//$("#searchbox").click(function () {
//    $(this).select();
//});
 // legend toggle
    $(document.body).on('click', '#legend-icon', function(){
        var toggleStatus = $('.map-legend').attr('data-status');

        if(toggleStatus === 'closed'){
            $('.map-legend').css('width', '320px').css('height', 'auto').attr('data-status', 'open');
            $('#legend-icon i').toggleClass('glyphicon glyphicon-list glyphicon glyphicon-minus');
            $('#legend-icon .legend-label').hide();
            $('.map-legend-items').show();
        }else{
            $('.map-legend').css('width', '80px').css('height', '32px').attr('data-status', 'closed');
            $('#legend-icon i').toggleClass('glyphicon glyphicon-minus glyphicon glyphicon-list');
            $('#legend-icon .legend-label').show();
            $('.map-legend-items').hide();
        }
    });

    function identify(e) {
        var layer = e.target;
        var props = layer.feature.properties;

        var content = "<div>"+(props.Station_Na)+" - "+(props.LINE)+" ("+(props.OPERATOR)+")</div>" 

        var stationinfo = "<div> Station Area Type: <b>"+(props.Type_1)+"</b></div>"
                         +"<div> Land Use Context: <b>"+(props.LUContext)+"</b></div>"
                         +"<div>Location: <b>"+(props.MCD)+", "+(props.CNTY)+" County</b></div>"

        var existinginfo ="<div><b>Transit Service Quality:</b>&nbsp; "+(props.TCI_Data)+" <i>TCI Score</i></div>"
                         +"<div><b>Job Access:</b>&nbsp;" + numeral(props.Job_Data).format('0,0') +" <i>jobs accessible within 30 minute transit ride</i></div>"
                         +"<div><b>Travel Time:</b>&nbsp;" +(props.Time_Data)+" <i>transit to auto travel time ratio</i></div>"
                         +"<div><b>Intensity (Residents + Employees):</b>&nbsp; "+numeral(props.Int_Data).format('0,0')+" <i>jobs accessible within 30 minute transit ride</i></div>"
                         +"<div><b>Households with 0 or 1 Car:</b>&nbsp; "+(props.Car_Data)+"%</div>"
                         +"<div><b>Non-Car Commuters:</b>&nbsp; "+(props.Com_Data)+" <i>jobs accessible within 30 minute transit ride</i></div>"
                         +"<div><b>Walk Score™:</b>&nbsp; "+(props.Walk_data)+" <i>jobs accessible within 30 minute transit ride</i></div>"

        var futureinfo ="<div><b>Development Activity:</b>&nbsp; "+(props.Dev_Data)+" <i>multifamily units recently built, under construction, or proposed</i></div>"
                         +"<div><b>Commercial Demand:</b>&nbsp; "+(props.CommRent_D)+" <i>5-year average rent per square foot for office space</i></div>"
                         +"<div><b>Residential Demand:</b>&nbsp; "+(props.ResRent_Da)+" <i>average asking rent per square foot for multifamily units</i></div>"
                         +"<div><b>Available Land:</b>&nbsp; <i>qualitative assessment</i></div>"
                         +"<div><b>Planning Context:</b>&nbsp; <i>qualitative assessment</i></div>"
                 

        document.getElementById('mapcard').innerHTML = content;
        document.getElementById('stationinfo_all').innerHTML = stationinfo;  
        document.getElementById('existing-data').innerHTML = existinginfo;  
        document.getElementById('future-data').innerHTML = futureinfo;  

        $('#cardbikepanel').show();
        $('#cardpedpanel').show();
        $('#mapcard').show();
        $('#stationinfo_all').show();
        $('#cardclick').hide();
        
        highlightRow.call(document.getElementById(L.stamp(layer)))
         
    //    $('#myTab a[href="#station_stats"]').tab('show');        
    //    document.getElementById('table_data').innerHTML = content;
    };

   function FTODPdraw(value) {
        $('#FTODPModal').one('shown.bs.modal', function() {
        $('#FTODPTabs a[data-target="#' + value + '"]').tab('show'); }).modal('show');

    }
    
  function EXTODdraw(value) {
        $('#EXTODModal').one('shown.bs.modal', function() {
        $('#EXTODTabs a[data-target="#' + value + '"]').tab('show'); }).modal('show');
        $('#FTODPModal').modal('close');
    } 

     

    function populatebarchart(e) {
        var layer = e.target;
        var props = layer.feature.properties,

        ExistingTODOV = [props.ExistingOr];
        updatebarchartEXOV(ExistingTODOV);

        ExistingTOD = [props.TCI_Score,props.Job_Score,props.Time_Score,props.Int_Score,props.Car_Score,props.Com_Score,props.Walk_Score];
        updatebarchart(ExistingTOD);

        FutureTODOV = [props.FuturePote];
        updatebarchartFUOV(FutureTODOV);

        FutureTOD = [props.Dev_Score,props.CommRent_S,props.ResRent_Sc,props.Land_Score,props.Planning_S];
        updatebarchart2(FutureTOD);
    }

    function updatebarchartEXOV(Values) {
    var options = {
        chart: {
            renderTo: 'existingOV',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
            height:100,
            spacingLeft: 15,
            backgroundColor:'#EFEFEF'
        },
        credits: {
            enabled: false
        },
        title: {
        //  text: 'Existing TOD Orientation',
          text:null,
            x: -20 //center
        },
        xAxis: {
            categories: [ 'Existing TOD Orientation'],
            labels: {
                style: {
                    fontSize: '14px',
                    color: 'black'
                }
            },
            tickColor: 'transparent',
            lineColor: 'transparent',
            labels: {useHTML: true}
        },
        plotOptions: {
            bar: {zoneAxis: 'y',
            zones: [{
                value: 0,
                color: '#77c9ed'
                }, {
                value: 1.99,
                color: '#77c9ed'
                }, {
                value: 2.99,
                color: '#24abe2'
                },  {
                color: '#046f9e'
            }]}
        },
        yAxis: {
            min: 0,
            max:4,
            tickInterval: 1,
            gridLineColor: "#046f9e",
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        series: [{
           name:'Total',
           id: 'Values',
           data: []
            
        }]
    };

    var Labels = [],
    counData = [];
    for (var i = 0; i < Values.length; i++){
    counData.push({
    name: Labels[i],
    y: Values[i]})
    }
    options.series[0].data = counData;
    chart = new Highcharts.Chart(options)
 //    console.log(bikeindata);

  $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
        console.log(this.textContent.split(' ')[0]);
         EXTODdraw(this.textContent.split(' ')[0]);
    });

    }

    function updatebarchart(Values) {
    var options = {
        chart: {
            renderTo: 'existing',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
            height:200,
            spacingLeft: 65,
            spacingRight: 65,
            backgroundColor: '#EFEFEF'
        },
         colors: ['#77c9ed']
       ,
        credits: {
            enabled: false
        },
        title: {
          //  text: 'Bicycle Volume by Month',
          text:null,
            x: -20 //center
        },
        xAxis: {
            categories: [ 'Transit Service Quality','Job Access','Travel Time','Intensity','Car Ownership','Non-Car Commuters','Walk Score<sup>TM</sup>'],
            tickColor: 'transparent',
            lineColor: 'transparent',
            labels: {useHTML: true}
        
        },
        yAxis: {
            min: 0,
            max:4,
            tickInterval: 1,
            height: 150,
            gridLineColor: "#046f9e",
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },

        series: [{
               name:'Total',
               id: 'Values',
               data: []
            }]
    };

    var Labels = [],
    counData = [];
    for (var i = 0; i < Values.length; i++){
    counData.push({
    name: Labels[i],
    y: Values[i]})
    }
    options.series[0].data = counData;
    chart = new Highcharts.Chart(options)

    $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
       // console.log(this.textContent.split(' ')[0]);
         EXTODdraw(this.textContent.split(' ')[0]);
    });
 //    console.log(bikeindata);
    }

    function updatebarchart2(Values) {
        var options = {
            chart: {
                renderTo: 'future',
                type:'bar',
                plotBackgroundColor: null,
                plotBorderWidth: 0,//null,
                plotShadow: false,
                height:200,
                spacingRight: 65,
                backgroundColor: '#EFEFEF'
            },
            colors: 
                ['#24abe2']
            ,
            credits: {
                enabled: false
            },
            title: {
              text:null,
                x: -20 //center
            },
            xAxis: {
                categories: [ 'Development Activity','Commercial Market Performance','Residential Market Performance','Available Land','Planning Context'],
                tickColor: 'transparent',
                lineColor: 'transparent',
                labels: {useHTML: true}
            },
            plotOptions: {
                column: {
                    colorByPoint: true,
                    colors: ['red','red','grey','blue','green'],
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            yAxis: {
                min: 0,
                max:4,
                tickInterval: 1,
                height: 150,
                gridLineColor: "#046f9e",
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            series: [{
               name:'Total',
               id: 'Values',
               data: []
            }]
        };

        var Labels = [],
        counData = [];
        for (var i = 0; i < Values.length; i++){
        counData.push({
        name: Labels[i],
        y: Values[i]})
        }
        options.series[0].data = counData;
        chart = new Highcharts.Chart(options)

          $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
       // console.log(this.textContent.split(' ')[0]);
         FTODPdraw(this.textContent.split(' ')[0]);
    });
     //    console.log(bikeindata);
    }

    function updatebarchartFUOV(Values) {
    var options = {
        chart: {
            renderTo: 'futureOV',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
            height:100,
            spacingLeft: 20,
            backgroundColor: '#EFEFEF'
        },
        colors: 
            ['#24abe2']
        ,
        credits: {
            enabled: false
        },
          title: {
              text:null,
                x: -20 //center
            },
        xAxis: {
            categories: [ 'Future TOD Potential'],
            labels: {
                style: {
                    fontSize: '16px',
                    color: 'black'
                }
            },
            tickColor: 'transparent',
            lineColor: 'transparent',
            labels: {useHTML: true}
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        yAxis: {
            min: 0,
            max:4,
            tickInterval: 1,
            gridLineColor: "#046f9e",
        //    height: 75,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        series: [{
           name:'Total',
           id: 'Values',
           data: []
        }]
    };

    var Labels = [],
    counData = [];
    for (var i = 0; i < Values.length; i++){
    counData.push({
    name: Labels[i],
    y: Values[i]})
    }
    options.series[0].data = counData;
    chart = new Highcharts.Chart(options)

      $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
       // console.log(this.textContent.split(' ')[0]);
         FTODPdraw(this.textContent.split(' ')[0]);
    });
 //    console.log(bikeindata);
    }

// Typeahead search functionality
$(document).one("ajaxStop", function() {
    $("#loading").hide();
    //tokenize each search array using Bloodhound
    var stationBH = new Bloodhound({
        name: "rs",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: stationSearch,
        limit: 10
    });
   
   //initialize 
   // stationBH.initialize();
    //activate Typeahead on Searchbox DOM element
    $("#searchbox").typeahead({
    	//define options (see Typeahead documentation)
    	minLength: 2,
        highlight: true,
        hint: false
    },{
        name: "rs",
        displayKey: "name",
        source: stationBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>Select a station...</h4>"
        }
    }
    ).on("typeahead:selected", function (obj, datum) {		//define action on selection of a search result
    	 if (datum.source === "rs") {
            map.setView([datum.lat, datum.lng], 17);
       //     $('#rs'+datum.id).simulate('click');
        };
    }).on("typeahead:opened", function () {
            $(".navbar-collapse.in").css("max-height", $(document).height()-$(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height()-$(".navbar-header").height());
        }).on("typeahead:closed", function () {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });

    
