//***************************************///
//  Open Freight App Core Functions
//  with Integrate Dynamic Icon Layers and legend builder
//  Core.js
//  Version: 1.0.1
//

//JQuery extend..create functions for easing in place of JQuery UI
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{def: 'easeOutQuad',
easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    }
});

function setMap(){
    $('.landingUI').fadeOut('fast', 'easeOutQuad' , function (){
             $('.mapUI').fadeIn('fast', 'easeInQuad' );
             $('#mapDIV').fadeIn('fast', 'easeInQuad' );
             map.invalidateSize();
             setTimeout(function() {$("#loading").hide();}, 300);
        });  
}

//load content based on hash
$(function() {
  // Javascript to enable link to tab
  var url = document.location.toString();
  if (url.match('#')) {
    var tab_id = url.split('#')[1];
    var prev_tab = url.split('#')[1];
    if (tab_id != 'map' && tab_id != undefined) {
        $('#' + tab_id).show();   
    }else {
       setMap();
   }
  }else {
    $('#home').show();
  }
  // Change hash for page-reload
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    window.location.hash = e.target.hash;  
  });
});
        
function getLocationHash () {
  return window.location.hash.substring(1);
}

//create navigation of content based on hash changes for self contained app
$(window).bind('hashchange', function() {
    var tab_id = getLocationHash();
    if (tab_id != 'map') {
    	$('.mapUI').fadeOut('fast', 'easeOutQuad' , function (){
             $('.landingUI').fadeIn('fast', 'easeInQuad' );
        });
        $('.landtab-content > .tab-pane').hide();
        $("#oFFlanding").animate({ scrollTop: 0 }, 50);
        $('#' + tab_id).show();  
    }else {
        setMap();
    }
});

// Placeholder hack for IE
if (navigator.appName == "Microsoft Internet Explorer") {
    $("input").each(function () {
        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
            $(this).val($(this).attr("placeholder"));
            $(this).focus(function () {
                if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
            });
            $(this).blur(function () {
                if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
            });
        }
    });
}
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
    
//Document Ready
$(document).ready(function () {
    
    $('input:checkbox[name="LayerCont"]').each( function () {
        var layers = [];
        if ($('#' + $(this).attr('id')).is(':checked')) {
            $('input:checkbox[name="LayerCont"]').each(function () {
                // Remove all overlay layers
                map.removeLayer(window[$(this).attr('id')]);
                if ($('#' + $(this).attr('id')).is(':checked')) {
                    // Add checked layers to array for sorting
                    layers.push({
                        'z-index': $(this).attr('z-index'),
                        'layer': $(this)
                    });
                }
            });
            // Sort layers array by z-index
            var orderedLayers = sortByKey(layers, 'z-index');
            // Loop through ordered layers array and add to map in correct order
            $.each(orderedLayers, function () {
                map.addLayer(window[$(this)[0].layer[0].id]);
            });
        } else {
            // Simply remove unchecked layers
            map.removeLayer(window[$(this).attr('id')]);
        }     
    });
});

///LayerControls: Order and add to Map as legend items are changed
//Z-index not yet functional in Leaflet

$('input:checkbox[name="LayerCont"]').on('change', function () {
    var layers = [];
    if ($('#' + $(this).attr('id')).is(':checked')) {
        $('input:checkbox[name="LayerCont"]').each(function () {
            // Remove all overlay layers
            map.removeLayer(window[$(this).attr('id')]);
            if ($('#' + $(this).attr('id')).is(':checked')) {
                // Add checked layers to array for sorting
                layers.push({
                    'z-index': $(this).attr('z-index'),
                    'layer': $(this)
                });
            }
        });
        // Sort layers array by z-index
        var orderedLayers = sortByKey(layers, 'z-index');
        // Loop through ordered layers array and add to map in correct order
        $.each(orderedLayers, function () {
            map.addLayer(window[$(this)[0].layer[0].id]);
        });
    } else {
        // Simply remove unchecked layers
        map.removeLayer(window[$(this).attr('id')]);
    }
});

//////////////////////////////////////////////////
////    		UI Functions  			//////////
//////////////////////////////////////////////////

///On load loading bar functionality
$( document ).ajaxStop(function() {
    setTimeout(function() {
              $("#loading").hide();
              
            }, 300);

});
/////////////////////////////////////////////////
//////////// New Leaflet Control ////////////////
/////////// Add Center to Region //////////////
///////////////////////////////////////////////
L.Control.mapCenter = L.Control.Zoom.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
    zoomMinText: "<i class='glyphicon glyphicon-globe'></i>",
    zoomMinTitle: "View Full Region",
    vcLatLng: [oLat, oLng],
    vcZoom: 10
  },

  onAdd: function (map) {
    var zoomName = "leaflet-control-zoom"
      , container = L.DomUtil.create("div", zoomName + " leaflet-bar")
      , options = this.options

    this._map = map

    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
     zoomName + '-in', container, this._zoomIn, this)

    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
     zoomName + '-out', container, this._zoomOut, this)

    this._zoomMinButton = this._createButton(options.zoomMinText, options.zoomMinTitle,
     zoomName + '-min', container, this._zoomMin, this)

    this._updateDisabled()
    map.on('zoomend zoomlevelschange', this._updateDisabled, this)

    return container
  },
  
  _zoomMin: function () {
    var opts = this.options
    var zoom = opts.vcZoom || 6;
    this._map.setView(opts.vcLatLng, zoom)
  },

  _updateDisabled: function () {
    var map = this._map
      , className = "leaflet-disabled"

    L.DomUtil.removeClass(this._zoomInButton, className)
    L.DomUtil.removeClass(this._zoomOutButton, className)
    L.DomUtil.removeClass(this._zoomMinButton, className)

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className)
    }

    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className)
    }

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomMinButton, className)
    }
  }
})
//Add controls
map.addControl(new L.Control.mapCenter());
         

    
