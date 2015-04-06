var MapLinks = {};

MapLinks.Map = function(){
    this.init = function(){
        var data = $('.test-map').data();

        var fsZoomed = false;

        var to;

        if(data && data.center) {
            var map = new GeoMap({
                id: 'test-map',
                fullScreenTrigger: '#fullscreen-trigger',
                zoom: 5,
                clusterer: true,
                clustererCountOfItems: true,
                controls: true,
                center: data.center,
                onFullscreenEnter: function(){
                    if(fsZoomed){
                        fsZoomed = true;
                        map.getMap().setZoom(map.getMap().getZoom() + 1);
                    }
                },
                onZoomChanged: function(zoom){
                    
                },
                onInit: function (instance) {
                    var i = 0;

                    var collection = new instance.Collection();

                    var items = [[65.48332977294922,21.399999618530273,10211],[55.483158111572266,28.799062728881836,null],[42.12607192993164,-80.0176010131836,null],[39.18360900878906,-96.57167053222656,null],[31.98983383178711,-111.11058807373047,null],[46.28883361816406,-107.07135009765625,null],[18.069623947143555,-96.12431335449219,null],[44.06820297241211,-114.7420425415039,null],[18.796464920043945,98.6600570678711,null],[33.65999984741211,-84.38999938964844,null],[53.93326950073242,-116.57649993896484,null],[46.14687728881836,-109.76766204833984,null],[46.67511749267578,-118.89432525634766,null],[53.26353073120117,34.41611099243164,null],[44.8485107421875,34.97490692138672,null],[52.43525314331055,31.002717971801758,null],[50.23527908325195,30.545000076293945,null],[44.371070861816406,-64.52100372314453,null],[40.40925979614258,49.86709213256836,null],[65.44999694824219,19.383333206176758,null],[45.054527282714844,-110.57698822021484,null],[36.784820556640625,-5.457789421081543,8782],[39.995826721191406,23.144866943359375,12029],[44.11872482299805,12.759063720703125,15909],[44.95375442504883,7.535356044769287,18242],[50.58318328857422,13.933371543884277,3108],[55.936309814453125,10.051834106445312,5904],[47.3516731262207,17.51255226135254,1677],[28.177297592163086,-15.780137062072754,1155],[42.87830352783203,17.570369720458984,5475],[39.91353225708008,1.0779385566711426,22096],[42.730281829833984,27.090551376342773,5814],[26.252845764160156,-80.6262435913086,705],[55.05854415893555,14.975530624389648,316],[34.9208869934082,33.29998016357422,8147],[51.297996520996094,5.437668800354004,1427],[56.95087814331055,24.005216598510742,3500],[40.3483772277832,-74.73438262939453,1607],[62.82508087158203,25.86768341064453,1570],[38.17425537109375,14.886777877807617,527],[44.3086051940918,-0.7103068232536316,1683],[12.92422103881836,100.87628936767578,1052],[59.44602966308594,17.95048713684082,77],[57.160057067871094,15.984039306640625,160],[50.575199127197266,0.38100147247314453,7459],[49.619529724121094,19.631757736206055,239],[35.890098571777344,25.79884147644043,1764],[58.997249603271484,6.850874900817871,256],[50.94064712524414,-4.240073204040527,180],[47.70640563964844,12.618073463439941,1868],[33.34926986694336,-117.65313720703125,1461],[41.469444274902344,-93.28370666503906,80],[53.1970100402832,-7.121668815612793,31],[49.68012237548828,8.93055534362793,310],[52.16481399536133,-9.535648345947266,74],[17.377849578857422,-62.4272346496582,61],[46.562843322753906,3.8167483806610107,47],[25.110334396362305,55.17779541015625,178],[39.71501159667969,9.138311386108398,143],[30.161104202270508,-85.66973876953125,21],[47.98448181152344,-3.4310872554779053,225],[59.76245880126953,30.382251739501953,2],[15.439435958862305,103.23365783691406,16],[67.05284118652344,14.103589057922363,10],[60.27393341064453,8.341593742370605,20],[62.7936897277832,14.261749267578125,20],[59.58049774169922,13.641899108886719,113],[62.899932861328125,7.6320037841796875,136],[59.83064651489258,10.814770698547363,3],[61.586788177490234,6.160922527313232,101],[42.9678840637207,-70.89946746826172,150],[66.03672790527344,12.782293319702148,11],[51.97624206542969,10.15895938873291,45],[56.589324951171875,-4.160390377044678,78],[42.42196273803711,-90.89659881591797,15],[40.97343826293945,-8.562335014343262,59],[61.299015045166016,10.584269523620605,42],[53.960205078125,22.15091896057129,42],[61.08904266357422,14.046056747436523,26],[40.49633026123047,-3.899240016937256,520],[49.37335205078125,22.691530227661133,4],[54.365413665771484,18.327836990356445,77],[52.26556396484375,17.335464477539062,9],[52.55594253540039,20.72369956970215,24],[32.71952438354492,-16.96206283569336,24],[37.741580963134766,-25.675378799438477,3],[42.6652946472168,-96.40384674072266,122],[38.62407684326172,27.086002349853516,7],[67.59200286865234,25.17401695251465,158],[66.52098083496094,27.26524543762207,90],[61.43355941772461,16.945083618164062,3],[53.52084732055664,7.488884449005127,60],[9.522415161132812,99.99188995361328,43],[22.58440589904785,88.42566680908203,2],[42.11470031738281,-87.71165466308594,113],[53.73075485229492,91.77606201171875,2],[53.08833694458008,-3.5505425930023193,82],[19.0301456451416,-98.42881774902344,5],[63.45392990112305,18.918514251708984,5],[41.71964645385742,-83.86742401123047,6],[60.43751525878906,23.357707977294922,126],[64.61299896240234,12.079537391662598,10],[35.991756439208984,-106.02286529541016,12],[35.456295013427734,-80.67532348632812,27],[63.09225082397461,21.911865234375,17],[39.017906188964844,-85.53981018066406,20],[37.49190902709961,-1.2864822149276733,2],[31.70306968688965,-96.7535171508789,4],[54.40047836303711,-0.8502545356750488,42],[37.56308364868164,21.338605880737305,13],[30.249513626098633,-104.23959350585938,3],[28.958349227905273,-97.89835357666016,14],[19.600526809692383,-70.2158203125,61],[62.883724212646484,29.98950958251953,22],[34.14331817626953,-88.80081939697266,17],[59.3435173034668,27.349925994873047,21],[35.94932556152344,-115.27778625488281,4],[54.8690299987793,25.344684600830078,40],[43.75971221923828,23.038606643676758,7],[39.192134857177734,-110.98637390136719,45],[43.35934829711914,-5.592319488525391,80],[13.565918922424316,-60.20903778076172,52],[33.80988311767578,10.990283966064453,3],[9.95511245727539,-84.20791625976562,9],[44.731895446777344,20.51581573486328,5],[11.813456535339355,108.82149505615234,6],[41.05780792236328,44.694541931152344,4],[55.74285125732422,37.60122299194336,30],[35.35428237915039,-97.20459747314453,11],[34.770660400390625,-99.85713958740234,3],[39.3894157409668,-80.44293212890625,12],[37.03601837158203,-87.32884216308594,2],[44.39107894897461,-75.681640625,2],[10.52028751373291,-64.87942504882812,3],[54.947235107421875,-7.70794677734375,3],[44.33842086791992,-93.80379486083984,13],[46.69191360473633,89.44113159179688,3],[66.60478973388672,23.918413162231445,14],[18.36762046813965,-65.30401611328125,3],[52.39849090576172,23.799240112304688,2],[37.449005126953125,-78.05986022949219,2],[27.264812469482422,33.75181579589844,5],[60.73836135864258,26.81075668334961,13],[38.98590850830078,34.865177154541016,2],[14.949999809265137,-23.520000457763672,2],[39.358333587646484,39.21611022949219,4],[31.92670440673828,-8.317688941955566,9],[41.740482330322266,41.64991760253906,4],[35.35826873779297,-84.4127197265625,2],[29.784156799316406,-9.8499755859375,4],[46.421199798583984,30.759737014770508,2],[39.6973762512207,-104.8854751586914,4],[43.128849029541016,-8.351888656616211,22],[61.90742111206055,21.637001037597656,2],[65.33700561523438,25.264713287353516,2],[10.748530387878418,104.25374603271484,3],[10.30345344543457,119.25264739990234,5],[29.04037857055664,-81.37123107910156,2],[32.404232025146484,-80.49938201904297,4],[38.93992614746094,-119.97718811035156,2],[39.05610656738281,-27.979082107543945,4],[53.90240478515625,27.56482696533203,2],[40.643798828125,14.447214126586914,31],[42.49226760864258,-78.09255981445312,2],[47.11930847167969,-95.93212890625,3],[10.728307723999023,-61.40754699707031,2],[44.38367462158203,-103.01716613769531,2]];

                    var load = function(){
                        _.each(items, function(item){
                            i++;

                            var c = (item[2] && item[2] > 0) ? item[2] : 1,
                                markerType,
                                zoomRelatedIcon = false;

                            c = Math.round(c);

                            markerType = map.getIconTypeNameByCount(c);

                            var pin = new map.Pin({
                                type: markerType,
                                avoidPanningAndBalloon: true,
                                center: [
                                    item[0],
                                    item[1]
                                ],
                                balloonCloseable: false,
                                counter: c,
                                content: 'Количество объектов: ' + c,
                                onClick: function(){
                                    clearTimeout(to);
                                    document.location.href = 'http://kvadroom.ru';
                                },
                            });

                            pin.getGeoObject().events.add('mouseenter', function(){
                                clearTimeout(to);

                                to = setTimeout(function(){
                                    clearTimeout(to);
                                    pin.showBalloon();
                                }, 300);
                            });

                            pin.getGeoObject().events.add('mouseleave', function(){
                                clearTimeout(to);

                                to = setTimeout(function(){
                                    clearTimeout(to);
                                    pin.hideBalloon();
                                }, 300);
                            });

                            collection.add(pin);
                        });

                        //instance.fitCluster();
                    }

                    load();
                   

                    //collection.draw();
                    //collection.fitBounds();

                    //instance.getMap().setZoom(instance.getMap().getZoom() + 2)
                }
            });

            map.init();
        }

        return this;
    };
};

MapLinks.init = function(){
    this.map = new this.Map().init();
};

$(function(){
    MapLinks.init();
});