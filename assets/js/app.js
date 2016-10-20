    var map, featureList;

    $(window).resize(function() {
        sizeLayerControl();
    });

    function highlightRow(e){
    // reset rows
       $("tr").css('background-color', 'white');
    //    $("tr").css('color', 'black');
    // set colour of row raising the click event 
     //   $(this).css('background-color', '#00FFFF');
        $(this).css('background-color','rgba(0, 255, 255, 0.6)');
    //    $(this).css('color', 'white');
    }

    $("#full-extent-btn").click(function() {
        map.fitBounds(stations.getBounds());
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#legend-btn").click(function() {
        $("#legendModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    function sizeLayerControl() {
        $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }

    /* Basemap Layers */
    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
    });

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
   /* Overlay Layers */

     $.getJSON('data/tod.js', function(data) {
        stations.addData(data);
        map.addLayer(stationsLayer);
    });


    styleOptions = {
    //  color: "#d53e4f",
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
         case 'aboveabove' : return {fillColor: "#f03b20"};
         case 'abovebelow' : return {fillColor: "#feb24c"};
         case 'belowabove' : return {fillColor: "#feb24c"};  
         case 'belowbelow' : return {fillColor: "#ffeda0"};  
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

        var DVRPC = L.geoJson(null, {
        style: {
            stroke: true,
            fillColor: 'none',
            color: '#969696',
            weight: 3,
            opacity: 1,
            clickable: false
        },
    });
    $.getJSON("data/cnty.js", function(data) {
        DVRPC.addData(data);
    });

    map = L.map("map", {
        zoom: 10,
        center: [39.952473, -75.164106],
        layers: [mapbox, DVRPC,stations],
        zoomControl: false,
        attributionControl: false
    });

    /* Attribution control */
    function updateAttribution(e) {
        $.each(map._layers, function(index, layer) {
            if (layer.getAttribution) {
                $("#attribution").html((layer.getAttribution()));
            }
        });
    }

    var attributionControl = L.control({
        position: "bottomright"
    });
    attributionControl.onAdd = function(map) {
        var div = L.DomUtil.create("div", "leaflet-control-attribution");
        div.innerHTML = "<span class='hidden-xs'></span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
        return div;
    };
    map.addControl(attributionControl);

    var zoomControl = L.control.zoom({
        position: "topleft"
    }).addTo(map);

    /* Larger screens get expanded layer control and visible sidebar */
    if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
    } else {
        var isCollapsed = false;
    }

    var baseLayers = {
        "Street Map": mapbox,
        "Imagery with Streets": Mapbox_Imagery
    };

    var layerControl = L.control.groupedLayers(baseLayers, {
        collapsed: isCollapsed
    }).addTo(map);

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

    stationsLayer.bringToFront();

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

    function legendraw(value) {
        $('#legendModal').one('shown.bs.modal', function() {
        $('#legendTabs a[href="#' + value + '"]').tab('show'); }).modal('show');
    }  

    function identify(e) {
        var layer = e.target;
        var props = layer.feature.properties;

        var content = "<div>"+(props.Station_Na)+" Station - "+(props.LINE)+" ("+(props.OPERATOR)+")</div>" 

        var content3 = "<div>Existing TOD Orientation"
                        +"</div>"

        var content4 = "<div>Future TOD Potential"
                        +"</div>"

        var stationinfo = "<div> Station Area Type: <b>"+(props.TYPE)+"</b>"
                         +" | Land Use Context: <b>"+(props.LUContext)+"</b></div>"
                         +"<div>Location: <b>"+(props.MCD)+", "+(props.CNTY)+" County</b></div>"
                            

        document.getElementById('card').innerHTML = content;
        document.getElementById('stationinfo_all').innerHTML = stationinfo;  
        document.getElementById('cardbike').innerHTML = content3;              
        document.getElementById('cardped').innerHTML = content4; 

        $('#cardbikepanel').show();
        $('#cardpedpanel').show();
        $('#card').show();
        $('#stationinfo_all').show();
        $('#cardclick').hide();
        
        highlightRow.call(document.getElementById(L.stamp(layer)))
         
    //    $('#myTab a[href="#station_stats"]').tab('show');        
    //    document.getElementById('table_data').innerHTML = content;
    };
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

    function updatebarchart(Values) {
    var options = {
        chart: {
            renderTo: 'existing',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: true,
            height:200,
            spacingLeft: 65,
            backgroundColor: '#DCDCDC'
        },
        colors: 
            ['#24abe2']
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
            height: 150,
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
         legendraw(this.textContent.split(' ')[0]);
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
                plotShadow: true,
                height:200,
                backgroundColor: '#DCDCDC'
            },
            colors: 
                ['#24abe2']
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
                categories: [ 'Development Activity','Commercial Market Performance','Residential Market Performance','Available Land','Planning Context']
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
                height: 150,
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
               pointWidth: 11,
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
    }


    function updatebarchartEXOV(Values) {
    var options = {
        chart: {
            renderTo: 'existingOV',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: true,
            height:100,
            backgroundColor: '#DCDCDC'
        },
        colors: 
            ['#24abe2']
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
            categories: [ 'Existing TOD Orientation']
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
 //    console.log(bikeindata);
  $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
       // console.log(this.textContent.split(' ')[0]);
         legendraw(this.textContent.split(' ')[0]);
    });
    }

    function updatebarchartFUOV(Values) {
    var options = {
        chart: {
            renderTo: 'futureOV',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: true,
            height:100,
            spacingLeft: 30,
            backgroundColor: '#DCDCDC'
        },
        colors: 
            ['#24abe2']
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
            categories: [ 'Futue TOD Potential']
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
 //    console.log(bikeindata);
    }

    /* Typeahead search functionality */
    $(document).one("ajaxStop", function() {
        $("#loading").hide();
        sizeLayerControl();
    });

    // Leaflet patch to make layer control scrollable on touch browsers
    var container = $(".leaflet-control-layers")[0];
    if (!L.Browser.touch) {
        L.DomEvent
            .disableClickPropagation(container)
            .disableScrollPropagation(container);
    } else {
        L.DomEvent.disableClickPropagation(container);
    }
