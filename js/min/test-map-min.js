var TestMap={};TestMap.Map=function(){this.init=function(){var t=$(".test-map").data();if(t&&t.center){var e=new GeoMap({id:"test-map",fullScreenTrigger:"#fullscreen-trigger",zoom:5,controls:!0,center:t.center,onInit:function(t){var n=new e.Pin({type:"basic_small",center:[55,25],content:"Text text text",onBalloonReady:function(){n.showBalloon()}}),o=new e.Pin({type:"basic",center:[55,22],balloonCloseButton:!0,content:"Text text text 2"}),l=new e.Pin({type:"basic_small",center:[55.4,22.2],balloonCloseButton:!0,content:"Text text text 2"}),a=new e.Pin({type:"basic_small",center:[55.42,22.23],balloonCloseButton:!0,content:"Text text text 2"}),c=new e.Pin({type:"basic_small",center:[56,21],balloonCloseButton:!0,content:"Text text text3"}),i=new e.Pin({type:"basic_small",center:[55.6,20.6],balloonCloseButton:!0,content:"Text text text3"}),s=new e.Pin({type:"basic_small",center:[55.65,20.64],balloonCloseButton:!0,content:"Text text text3"}),x=new e.Pin({type:"basic_small",center:[52,24],balloonCloseButton:!0,content:"Text text text"}),r=new e.Pin({type:"basic_small",center:[52.1,24.1],balloonCloseButton:!0,content:"Text text text"}),r=new e.Pin({type:"basic_small",center:[52.14,24.16],balloonCloseButton:!0,content:"Text text text"}),b=new e.Pin({type:"basic_small",center:[54,22],balloonCloseButton:!0,content:"Text text text"}),p=new e.Pin({type:"basic_small",center:[54.9,22.5],balloonCloseButton:!0,content:"Text text text"}),u=new e.Pin({type:"basic_small",center:[54.319,22.58],balloonCloseButton:!0,content:"Text text text"})}});e.init()}return this}},TestMap.init=function(){this.map=(new this.Map).init()},$(function(){TestMap.init()});