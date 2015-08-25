OpenLayers.Layer.Heatmap=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:!1,heatmap:null,mapLayer:null,tmpData:{},initialize:function(a,b,d,e,f){var c=document.createElement("div");OpenLayers.Layer.prototype.initialize.apply(this,[a,f]);c.style.cssText="position:absolute;width:"+b.size.w+"px;height:"+b.size.h+"px;";this.div.appendChild(c);e.element=c;this.mapLayer=d;this.map=b;this.heatmap=h337.create(e);a=function(){this.tmpData.max&&this.updateLayer()};b.events.register("zoomend",this,a);b.events.register("moveend",
this,a)},updateLayer:function(){var a=this.getPixelOffset(),b=this.heatmap.get("element");b.style.top=(0<a.y?"-"+a.y:Math.abs(a.y))+"px";b.style.left=(0<a.x?"-"+a.x:Math.abs(a.x))+"px";this.setDataSet(this.tmpData)},getPixelOffset:function(){var a=this.mapLayer.map.layerContainerOrigin,a=new OpenLayers.LonLat(a.lon,a.lat),a=this.mapLayer.getViewPortPxFromLonLat(a),b=this.mapLayer.map.center,b=new OpenLayers.LonLat(b.lon,b.lat),b=this.mapLayer.getViewPortPxFromLonLat(b);return{x:a.x-b.x,y:a.y-b.y}},
setDataSet:function(a){var b={},d=a.data,e=d.length,f,c;b.max=a.max;for(b.data=[];e--;)f=d[e],c=f.lonlat.clone().transform(this.projection,this.map.getProjectionObject()),(c=this.roundPixels(this.getViewPortPxFromLonLat(c)))&&b.data.push({x:c.x,y:c.y,count:f.count});this.tmpData=a;this.heatmap.store.setDataSet(b)},roundPixels:function(a){if(0>a.x||0>a.y)return!1;a.x>>=0;a.y>>=0;return a},addDataPoint:function(a){var b=this.roundPixels(this.mapLayer.getViewPortPxFromLonLat(a)),d={lonlat:a};2==arguments.length&&
(d.count=arguments[1]);this.tmpData.data.push(d);b&&(b=[b.x,b.y],2==arguments.length&&b.push(arguments[1]),this.heatmap.store.addDataPoint.apply(this.heatmap.store,b))},toggle:function(){this.heatmap.toggleDisplay()},destroy:function(){OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments)},CLASS_NAME:"OpenLayers.Layer.Heatmap"});