<template>
    <div class="outer_div">
        <ul class="towns_list">
            <li><a v-on:click="openTown" class="town_links uk-link-heading active">Казань</a></li>
            <li><a v-on:click="openTown" class="town_links uk-link-heading">Н. Челны</a></li>
            <li><a v-on:click="openTown" class="town_links uk-link-heading">Елабуга</a></li>
            <li><a v-on:click="openTown" class="town_links uk-link-heading">Чистополь</a></li>
        </ul>


        <div class="inner_block">
            <div class="nav-parent-wrapper">
                <div class="round_checkbox" v-on:click="clickRoundCheckbox">
                    <input type="checkbox" class="round_checkbox_input" checked/>
                    <label></label>
                </div>
                <button class="nav-parent" v-on:click="showChild"><div>Учебные здания</div>
                    <svg x="0px" y="0px"
                         viewBox="0 0 477.175 477.175" >
                        <g class="svg_center"><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
		c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg></button>
            </div>
            <ul class="nav-child">
                <li class="nav-child-item">
                    <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                        <input type="checkbox" class="round_checkbox_input"  checked/>
                        <label></label>
                    </div>
                    <a href="#" v-on:click="setLinkFocused"><p>Главное здание</p><p>Кремлёвская, 18</p></a>
                </li>
                <li class="nav-child-item">
                    <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                        <input type="checkbox" class="round_checkbox_input"  checked/>
                        <label></label>
                    </div>
                    <a href="#" v-on:click="setLinkFocused"><p>Второй корпус</p><p>Кремлёвская, 35</p></a>
                </li>
            </ul>

            <div class="nav-parent-wrapper">
                <div class="round_checkbox" v-on:click="clickRoundCheckbox">
                    <input type="checkbox" class="round_checkbox_input" checked />
                    <label></label>
                </div>
                <button class="nav-parent" v-on:click="showChild"><div>Общежития</div>
                    <svg x="0px" y="0px"
                         viewBox="0 0 477.175 477.175" >
                        <g class="svg_center"><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
		c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg></button>
            </div>
            <ul class="nav-child">
                <li class="nav-child-item">
                    <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                        <input type="checkbox" class="round_checkbox_input"  checked/>
                        <label></label>
                    </div>
                    <a href="#" v-on:click="setLinkFocused"><p>Деревня Универсиады</p></a>
                </li>
                <li class="nav-child-item">
                    <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                        <input type="checkbox" class="round_checkbox_input"  checked/>
                        <label></label>
                    </div>
                    <a href="#" v-on:click="setLinkFocused"><p>Красная позиция</p></a>
                </li>
            </ul>
        </div>

        <div id="map" class="mapbox"></div>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'

    export default {
        name: "KFUMaps",
        methods: {
            openTown: function(event) {
                var tablinks = document.getElementsByClassName("town_links");
                for (var i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }
                event.currentTarget.className += " active";
            },
            clickRoundCheckbox: function(event) {
                var isChecked = !event.target.previousElementSibling.checked;
                event.target.previousElementSibling.checked = isChecked;

                if (event.target.parentNode.parentNode.className === "nav-parent-wrapper") {
                    setCheckedAllChildrenOf(event.target.parentNode.parentNode.nextElementSibling, isChecked);
                    clearOrAddAllBuildingMarkersByType(isChecked, event.target.parentNode.nextElementSibling.parentNode.nextElementSibling);
                } else {
                    uncheckParentIfEmpty(event.target.parentNode.parentNode.parentNode);
                    clearOrAddBuildingMarker(isChecked, event.target.parentNode.nextElementSibling.childNodes[0].innerHTML);
                }
            },
            showChild: function(event) {
                var el = event.target.parentElement;
                el.classList.toggle("nav-parent_active");

                var panel = el.parentElement.nextElementSibling;

                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            },
            setLinkFocused: function(event) {
                var arr = document.getElementsByClassName("nav-child-item_a_focus");
                for (var i=0;i< arr.length; i++) {
                    arr[i].classList.remove("nav-child-item_a_focus");
                }

                var el = event.target;
                while (el.tagName !== "A") {
                    el = el.parentElement;
                }
                el.classList.add("nav-child-item_a_focus");

                var building_name = el.childNodes[0].innerHTML;

                var building_center = buildingsarray.filter(function (item) {
                    return item.name===building_name;
                })[0].coords;

                map.flyTo({zoom: 15, center: building_center, duration: 1000 });
            }
        }
    }

    function setCheckedAllChildrenOf(parent, value){
        var arr = parent.children;
        for (var i = 0; i<arr.length; i++) {
            console.log(arr[i].children[0].children[0].checked = value);
        }
    }

    function uncheckParentIfEmpty(parent){
        var arr = parent.children;
        var isEmpty = 0;
        for (var i = 0; i<arr.length; i++) {
            isEmpty = isEmpty + arr[i].children[0].children[0].checked;
        }
        parent.previousElementSibling.children[0].children[0].checked = isEmpty!==0;
    }

    function clearOrAddAllBuildingMarkersByType(value, parent){
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            clearOrAddBuildingMarker(value, children[i].children[1].children[0].innerHTML);
        }
    }

    function clearOrAddBuildingMarker(value, name){
        var ind = 0;
        for (var i = 0; i < buildingsarray.length; i++) {
            if (buildingsarray[i].name === name) {
                ind = i;
            }
        }

        markers_list[ind].getElement().style.opacity = value ? "1" : "0";
    }


    var buildingsarray = [];
    var markers_list = [];
    var map;

    document.addEventListener('DOMContentLoaded', function(){

        mapboxgl.accessToken = 'pk.eyJ1IjoibWFnZW50YWkiLCJhIjoiY2s3dnYxNGM2MDZiZTNmbm45c25vOG04dSJ9.yKeUDhl57--T2uMVzQFuGA';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/magentai/ck9u58ftx0zzn1iqam0b3f597/draft',
            zoom: 15,
            minZoom: 9,
            center: [49.121815379295526, 55.79086830609842],
            maxBounds: [[48.784006180441224,55.60902821610202],[49.48717222440314,55.99577053949221]]
        });

        // add markers
        var building = {name: "Главное здание",
            coords: [49.121815379295526, 55.79086830609842]}
        var building2 = {name: "Второй корпус",
            coords: [49.122113604668584, 55.792150207888284]}
        var building3 = {name: "Деревня Универсиады",
            coords: [49.18479432507627, 55.7414034713012]}
        var building4 = {name: "Красная позиция",
            coords: [49.16506039239721, 55.78916226409763]}
        buildingsarray = [building,building2,building3,building4];

        var eduEl = this.createElement('div');
        eduEl.className = 'markerEdu';
        var livingEl = document.createElement('div');
        livingEl.className = 'markerLive';

        console.log('12345');
        // var marker = new mapboxgl.Marker(eduEl)
        //     .setLngLat(building.coords)
        //     .addTo(map);
        // var marker2 = new mapboxgl.Marker(eduEl.cloneNode())
        //     .setLngLat(building2.coords)
        //     .addTo(map);
        // var marker3 = new mapboxgl.Marker(livingEl)
        //     .setLngLat(building3.coords)
        //     .addTo(map);
        // var marker4 = new mapboxgl.Marker(livingEl.cloneNode())
        //     .setLngLat(building4.coords)
        //     .addTo(map);
        var marker = new mapboxgl.Marker()
            .setLngLat(building.coords)
            .addTo(map);
        var marker2 = new mapboxgl.Marker()
            .setLngLat(building2.coords)
            .addTo(map);
        var marker3 = new mapboxgl.Marker()
            .setLngLat(building3.coords)
            .addTo(map);
        var marker4 = new mapboxgl.Marker()
            .setLngLat(building4.coords)
            .addTo(map);


        markers_list = [marker, marker2,marker3,marker4];
        markers_list.forEach(function (item, i) {
            if (i<2)
            item.getElement().classList.add('markerEdu')
            else item.getElement().classList.add('markerLive')
            item.getElement().innerHTML = "";
        });
        console.log(markers_list);

        map.on('load', function() {


        //     map.addSource('points', {
        //             'type': 'geojson',
        //             'data': {
        //                 'type': 'FeatureCollection',
        //                 'features': [
        //                     {
        //                         'type': 'Feature',
        //                         'geometry': {
        //                             'type': 'Point',
        //                             'coordinates': building.coords
        //                         },
        //                         'properties': {
        //                             'title': 'Главное здание',
        //                             'icon': 'college'
        //                         }
        //                     },
        //                     {
        //                         'type': 'Feature',
        //                         'geometry': {
        //                             'type': 'Point',
        //                             'coordinates': building2.coords
        //                         },
        //                         'properties': {
        //                             'title': 'Второй корпус',
        //                             'icon': 'college'
        //                         }
        //                     },
        //                     {
        //                         'type': 'Feature',
        //                         'geometry': {
        //                             'type': 'Point',
        //                             'coordinates': building3.coords
        //                         },
        //                         'properties': {
        //                             'title': 'Деревня универсиады',
        //                             'icon': 'lodging'
        //                         }
        //                     },
        //                     {
        //                         'type': 'Feature',
        //                         'geometry': {
        //                             'type': 'Point',
        //                             'coordinates': building4.coords
        //                         },
        //                         'properties': {
        //                             'title': 'Красная позиция',
        //                             'icon': 'lodging'
        //                         }
        //                     }
        //                 ]
        //             }
        //         });
        //         map.addLayer({
        //             'id': 'points',
        //             'type': 'symbol',
        //             'source': 'points',
        //             'layout': {
        //                 'icon-image': ['concat', ['get', 'icon'], '-15'],
        //                 'text-field': ['get', 'title'],
        //                 'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //                 'text-offset': [0, 0.6],
        //                 'text-anchor': 'top'
        //             }
        //     });
        });
    });
</script>

<style>
    @import 'mapbox-gl.css';

    html {
        color: white;
    }
    body {
        font-family: 'PT Sans', sans-serif;
        background: #fff;
        margin: 0;
    }

    .outer_div{
        display: flex;
        margin-left: 120px;
        margin-right: 200px;
    }
    .towns_list {
        margin-top: 50px;
        list-style-type: none;
        margin-right: 45px;
        cursor: pointer;
    }
    .towns_list li {
        text-align: right;
        margin-bottom: 30px;
    }
    .town_links {
        color: #acacac !important;
        font-size: 26px;
        font-weight: bold;
        font-family: 'PT Sans', sans-serif;
    }
    .town_links.active {
        color: #3b3b3b !important;
    }

    .inner_block {
        padding: 50px 45px 0px 45px;
        color: white;
        background-color: #00549f;
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-flow: column nowrap;
        overflow: scroll;
    }
    .nav-parent-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .round_checkbox {
        margin-top: 2px;
        position: relative;
        margin-right: 25px;
    }
    .round_checkbox label {
        background-color: transparent;
        border: 1px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
        height: 20px;
        width: 20px;
        left: 0;
        position: absolute;
        top: 0;
    }

    .round_checkbox label:after {
        border: 2px solid #00549f;
        border-top: none;
        border-right: none;
        content: "";
        height: 6px;
        left: 4.5px;
        opacity: 0;
        position: absolute;
        top: 4.5px;
        transform: rotate(-45deg);
        width: 10px;
    }

    .round_checkbox input[type="checkbox"] {
        visibility: hidden;
    }
    .round_checkbox input[type="checkbox"]:checked + label {
        background-color: white;
        border-color: white;
    }

    .round_checkbox input[type="checkbox"]:checked + label:after {
        opacity: 1;
    }

    .round_checkbox_mini {
        margin-top: 2px;
        position: relative;
        margin-right: 15px;
    }
    .round_checkbox_mini label {
        background-color: rgba(255,255,255,0.2);
        border-radius: 50%;
        cursor: pointer;
        height: 18px;
        width: 18px;
        left: 0;
        position: absolute;
        top: 0;
    }

    .round_checkbox_mini label:after {
        border: 2px solid white;
        border-top: none;
        border-right: none;
        content: "";
        height: 4px;
        left: 4.5px;
        opacity: 0;
        position: absolute;
        top: 5px;
        transform: rotate(-45deg);
        width: 7px;
    }

    .round_checkbox_mini input[type="checkbox"] {
        visibility: hidden;
    }
    .round_checkbox_mini input[type="checkbox"]:checked + label {
        border-color: white;
    }

    .round_checkbox_mini input[type="checkbox"]:checked + label:after {
        opacity: 1;
    }

    .nav-parent {
        padding: 0px;
        color: white;
        font-size: 20px;
        font-family: 'PT Sans', sans-serif;
        font-weight: 600;
        border: none;
        text-align: left;
        cursor: pointer;
        background-color: #00549f;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .nav-parent:active {
        padding: 0px;
    }
    .nav-parent > svg {
        width: 15px;
        height: 15px;
        fill: white;
    }
    .nav-parent > svg g {
        transition: transform 0.3s ease-out;
    }
    .nav-parent_active > svg g {
        transform: rotate(-90deg);
    }
    .svg_center {
        transform-origin: center center;
    }
    .nav-parent > div {
        flex-grow: 1;
    }
    .nav-child {
        font-weight: bold;
        color: white;
        list-style-type: none;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
    }
    .nav-child p{
        margin: 0;
    }
    .nav-child-item {
        margin: 0 0 7px 0;
        display: flex;
        align-items: center;
        font-family: 'PT Sans', sans-serif;
    }
    .nav-child-item p:last-of-type {
        font-weight: normal;
    }
    .nav-child-item p:first-of-type {
        font-weight: bold;
    }
    .nav-child-item a:active,
    .nav-child-item a:hover {
        background-color: #1f73be;
    }
    .nav-child-item_a_focus{
        box-shadow: -2px 0 0 white;
        background-color: #1f73be;
    }
    .nav-child-item a {
        padding: 5px 0 5px 20px;
        display: inline-block;
        width: 100%;
        color: white !important;
        text-decoration: none !important;
        transition: all 0.2s ease;
    }

    .mapbox {
        height: 100vh;
        width: 100%;
    }
    .markerEdu {
        background-color: #00549f;
        background-image: url('https://image.flaticon.com/icons/svg/1810/1810660.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 70%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }
    .markerLive {
        background-color: orange;
        background-image: url('https://image.flaticon.com/icons/svg/2590/2590698.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 70%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }
    #map {
        cursor: pointer;
    }
</style>