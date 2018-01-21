function InfoComponent(){
    const i = this;
    Component.apply(i, arguments);
    const _parentRender = i._renderTemplate;
    i.initMap = function(){
        const Latlng = new google.maps.LatLng(50.4431911, 30.5186722)
        ,mapOpts = myOptions = {
            zoom: 15
            ,center: Latlng
            ,mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        ,map = new google.maps.Map(i._mapContainer, mapOpts)
        ,marker = new google.maps.Marker({
            position: Latlng,
            map: map,
            title:"Ми тут!" 
        });
        return map;
    }
    i._renderTemplate = function(sTemplate, fetchedData){
        const renderedTemplate = _parentRender(sTemplate, fetchedData);
        i._mapContainer = renderedTemplate.querySelector('.info__map')
        i.initMap();
        return renderedTemplate;
        i.activate()
    }
    i.createComponent();
}
InfoComponent.prototype = Object.create(Component.prototype);
InfoComponent.prototype.constructor = InfoComponent;