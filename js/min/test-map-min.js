var TestMap={};TestMap.Map=function(){this.init=function(){var t=$(".test-map").data();if(t&&t.center){var e=new GeoMap({id:"test-map",fullScreenTrigger:"#fullscreen-trigger",zoom:4,center:t.center,onInit:function(t){var n=new e.Pin({type:"basic_small",center:[55,25],balloonCloseButton:!0,content:"Text text text"}),i=new e.Pin({type:"basic",center:[55,22],balloonCloseButton:!0,content:"Text text text 2"}),o=new e.Pin({type:"basic_small",center:[56,21],balloonCloseButton:!0,content:"Text text text3"}),a=new e.Pin({type:"basic",center:[52,24],balloonCloseButton:!0,content:"Text text text"}),c=new e.Pin({type:"basic_small",center:[54,22],balloonCloseButton:!0,content:"Text text text"})}});e.init()}return this}},TestMap.init=function(){this.map=(new this.Map).init()},$(function(){TestMap.init()});