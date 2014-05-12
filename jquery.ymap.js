/**
  Yandex Map
*/
(function($){
	var YandexMap= function(element, options) {
		var config = $.extend({
      url: 'http://api-maps.yandex.ru/2.1/?lang=ru-RU',
      dataCnt: element,
      dataGeo: 'geo',
      dataTitle: 'title',
      dataText: 'text',
      balloonStyle: 'islands#darkGreenIcon',
      mapControls: ['zoomControl', 'trafficControl', 'fullscreenControl'],
      mapScale: 13
		}, options || {});
		
		var $element = $(element);
    var $dataCnt = $(config.dataCnt);

		// init
		this.init = function() {
      $(document).ready(function() {
        // load api
        if (!window.ymaps) {
          $.getScript(config.url)
            .done(function( script, textStatus ) {
              ymaps.ready(initYMap);
            })
            .fail(function( jqxhr, settings, exception ) {
              console.log('Error Yandex.Maps API loading');
          });
        } else {
          ymaps.ready(initYMap);
        }
      });
		};

    var initYMap = function() {
      
      $element.empty(); // clear map container

      var map = new ymaps.Map(element, {
        center: [51.606654,45.895677],
        zoom: 11,
        maxZoom: 11,
        type: "yandex#map",
        controls: config.mapControls
      });
      
      var myCollection = new ymaps.GeoObjectCollection(null, {
        preset: config.balloonStyle //balloon preset style
      });
      
      $dataCnt.each(function(i){
      	var dataGeo = $(this).data(config.dataGeo);
      	if (dataGeo) {
	        myCollection.add(new ymaps.Placemark(dataGeo.split(','), {
	          balloonContentHeader: $(this).data(config.dataTitle),
	          balloonContentBody: $(this).data(config.dataText)
	        }));
      	}
      });

      // Добавляем коллекцию на карту.
      map.geoObjects.add(myCollection);

      // Устанавливаем карте центр и масштаб так, чтобы охватить коллекцию целиком.
      map.setBounds(myCollection.getBounds(),{
        checkZoomRange: true
      });
      // при одной метке getBounds возвращает массив из двух одинаковых точек, поэтому можем вязть первую для центрирования
      // console.log(myCollection.getBounds())
      if (myCollection.getLength() == 1) {
        myCollection.getMap().setCenter(myCollection.getBounds()[0], config.mapScale);
      }
    }

	};

	// http://www.virgentech.com/blog/2009/10/building-object-oriented-jquery-plugin.html
	// http://learn.jquery.com/plugins/
	$.fn.yMap = function(options) {
		return this.each(function() {
			var $element = $(this);
			if ($element.data('yMap')) return; // Return early if this element already has a plugin instance
			var yMap = new YandexMap(this, options); // pass options to plugin constructor
			$element.data('yMap', yMap); // Store plugin object in this element's data
			yMap.init();
		});
	};
})(jQuery);
