<template>
    <div class="outer_div" v-if="!loading">
        <ul class="towns_list">
            <li v-for="city in cities" :key="city.name" ><a v-on:click="openTown"  class="town_links uk-link-heading" v-bind:class="{ active: city.name === 'Казань' }">{{city.name}}</a></li>
        </ul>

        <div class="map_content">
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
                    <li class="nav-child-item" v-for="building in getBuildingsOfType(0)" :key="building.title" >
                        <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                            <input type="checkbox" class="round_checkbox_input"  checked/>
                            <label></label>
                        </div>
                        <a href="#" v-on:click="setLinkFocused"><p class="building_name">{{building.title}}</p><p v-if="building.address">{{building.address}}</p></a>
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
                    <li class="nav-child-item" v-for="building in getBuildingsOfType(1)" :key="building.title" >
                        <div class="round_checkbox_mini" v-on:click="clickRoundCheckbox">
                            <input type="checkbox" class="round_checkbox_input"  checked/>
                            <label></label>
                        </div>
                        <a href="#" v-on:click="setLinkFocused"><p class="building_name">{{building.title}}</p><p v-if="building.address">{{building.address}}</p></a>
                    </li>
                </ul>

                <div class="search_field_popup uk-card" v-on:focusout="hidePopup">
                    <ul class="search_result_list">
                        <li v-for="building in search_results" :key="building.title" v-on:click="clickSearchResultItem">
                            {{building.title}}
                        </li>
                    </ul>
                </div>
                <input type="text" placeholder="Поиск..." uk-icon="search" class="search_field uk-input uk-search-input" v-on:input="searchFieldInput" v-on:focusin="showPopup" />
            </div>
            <div class="expand_button_wrapper">
                <div class="expand_button" v-on:click="expandMap" style="transform: rotate(180deg);">
            </div>
            </div>
            <div class="map_wrapper">
                <div class="map_blocker"></div>
                <div id="map" class="mapbox">
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl';
    import axios from 'axios'

    var data = {
        search_filter: "",
        buildings: [
        {   id: 0,
            name: "Главное здание",
            addr: "Кремлёвская, 18",
            coords: [49.121815379295526, 55.79086830609842],
            type: 0,
            city_id: 0 },
        {   id: 1,
            name: "Второй корпус",
            addr: "Кремлёвская, 35",
            coords: [49.122113604668584, 55.792150207888284],
            type: 0,
            city_id: 0 },
        {   id: 2,
            name: "Деревня Универсиады",
            coords: [49.18479432507627, 55.7414034713012],
            type: 1,
            city_id: 0 },
        {   id: 3,
            name: "Красная позиция",
            coords: [49.16506039239721, 55.78916226409763],
            type: 1,
            city_id: 0 }
    ],
    cities : [{id: 0, name: "Казань", center: [49.121815379295526,55.79086830609842]}, {id: 1, name: "Н. Челны", center: [52.40073983330103, 55.74134240544038]}, {id: 2, name: "Елабуга", center: [52.05435872588566, 55.757598796312465]}, {id: 3, name: "Чистополь", center: [50.63665252982105, 55.37135945884043]}],
    buildingTypes: [
        {id: 0, name: "Учебные здания"},
        {id: 1, name: "Общежития"}
    ]};

    export default {
        name: "KFUMaps",
        data() {
            return {
                buildings: undefined,
                cities: data.cities,
                buildingTypes: data.buildingTypes,
                search_filter: "",
                map: undefined,
                markers_list: [],
                loading: true
            }
        },
        methods: {
            openTown: function(event) {
                var tablinks = document.getElementsByClassName("town_links");
                var arr = [];
                for (var i = 0; i < tablinks.length; i++) {
                    tablinks[i].classList.remove("active");
                }
                event.currentTarget.className += " active";

                var city = this.cities.find(function (item) {
                    return item.name===event.target.innerHTML;
                });
                this.map.setCenter(city.center);
                this.map.zoomTo(12);

                var j;
                if(city.name!=="Казань") {
                    arr = document.getElementsByClassName("nav-parent-wrapper");
                    for (j = 0; j < arr.length; j++) {
                        arr[j].style.opacity = 0;
                    }
                    arr = document.getElementsByClassName("nav-child");
                    for (j = 0; j < arr.length; j++) {
                        arr[j].style.opacity = 0;
                    }
                } else {
                    arr = document.getElementsByClassName("nav-parent-wrapper");
                    for (j = 0; j < arr.length; j++) {
                        arr[j].style.opacity = 1;
                    }arr = document.getElementsByClassName("nav-child");
                    for (j = 0; j < arr.length; j++) {
                        arr[j].style.opacity = 1;
                    }
                }
            },
            clickRoundCheckbox: function(event) {
                var isChecked = !event.target.previousElementSibling.checked;
                event.target.previousElementSibling.checked = isChecked;

                if (event.target.parentNode.parentNode.className === "nav-parent-wrapper") {
                    setCheckedAllChildrenOf(event.target.parentNode.parentNode.nextElementSibling, isChecked);
                    clearOrAddAllBuildingMarkersByType(isChecked, event.target.parentNode.nextElementSibling.parentNode.nextElementSibling, this);
                } else {
                    uncheckParentIfEmpty(event.target.parentNode.parentNode.parentNode);
                    clearOrAddBuildingMarker(isChecked, event.target.parentNode.nextElementSibling.childNodes[0].innerHTML, this);
                }
            },
            showChild: function(event) {
                var el = event.target.parentElement;
                el.classList.toggle("nav-parent_active");

                var panel = el.parentElement.nextElementSibling;

                panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
            },
            setLinkFocused: function(event) {
                showChildIfNotShown(event.target.parentElement.parentElement.parentElement.previousElementSibling.children[1]);

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

                var building = this.buildings.find(function (item) {
                    return item.title===building_name;
                });

                el.previousElementSibling.children[0].checked = true;
                clearOrAddBuildingMarker(true, building_name, this);
                uncheckParentIfEmpty(el.parentNode.parentNode);

                this.map.on('zoomstart', function() {
                    console.log(1);
                    this.markers_list.forEach(function (item) {
                        if (item.getPopup().isOpen()) {
                            item.togglePopup();
                        }
                    });
                }, this);
                this.map.on('zoomend', function() {
                    getMarkerByBuildingName(building.title, this).getElement().click();
                }, this);
                this.map.flyTo({zoom: 15, center: retrieveCoordinates(building.coordinates) }, {building_id : building.id});

                document.getElementsByClassName("search_field")[0].value = "";
            },
            getBuildingsOfType: function(value) {
                return this.buildings.filter(function (item) {
                    return item.type===(this.buildingTypes.find(type => type.id === value).name);
                }, this);
            },
            expandMap: function(event) {
                document.getElementsByClassName("inner_block")[0].addEventListener("transitionstart", function () {
                    document.getElementsByClassName("map_blocker")[0].style.zIndex = "1";
                    this.map.resize();
                }, {once : true});
                document.getElementsByClassName("inner_block")[0].addEventListener("transitionend", function () {
                    document.getElementsByClassName("map_blocker")[0].style.zIndex = "0";
                    this.map.resize();
                }, {once : true});

                if (event.target.style.transform==="rotate(180deg)")  {
                    event.target.style.transform = "rotate(0deg)";
                    document.getElementsByClassName("inner_block")[0].style.width = "0%";
                    document.getElementsByClassName("inner_block")[0].style.padding = "50px 0px 0px 0px";
                    document.getElementsByClassName("inner_block")[0].style.opacity="0";
                } else {
                    event.target.style.transform = "rotate(180deg)";
                    document.getElementsByClassName("inner_block")[0].style.width = "30vw";
                    document.getElementsByClassName("inner_block")[0].style.padding = "50px 45px 0px 45px";
                    document.getElementsByClassName("inner_block")[0].style.opacity="1";
                }
            },
            searchFieldInput: function (event) {
                this.search_filter = event.target.value;

                event.target.previousElementSibling.style.maxHeight = this.search_filter === "" ? "0px" : "250px";
            },
            clickSearchResultItem: function (event) {
                var arr = document.getElementsByClassName("building_name");
                var result;
                for (var i = 0; i< arr.length; i++) {
                    if (arr[i].innerHTML.toLowerCase().includes(event.target.innerHTML.trim().toLowerCase())) {
                        result = arr[i];
                    }
                }
                result.click();
                event.target.parentElement.parentElement.style.maxHeight = "0px";
            },
            hidePopup: function (event) {
                event.target.previousElementSibling.style.maxHeight = "0px";
            },
            showPopup: function (event) {
                event.target.previousElementSibling.style.maxHeight = this.search_filter === "" ? "0px" : "250px";
            }
        },
        computed: {
            search_results: function () {
                return this.search_filter === "" ? this.buildings :
                    this.buildings.filter(function (item) {
                    return item.title.toLowerCase().includes(this.search_filter.toLowerCase());
                }, this);
            }
        },
        updated() {
            mapboxgl.accessToken = 'pk.eyJ1IjoibWFnZW50YWkiLCJhIjoiY2s3dnYxNGM2MDZiZTNmbm45c25vOG04dSJ9.yKeUDhl57--T2uMVzQFuGA';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/magentai/ck9u58ftx0zzn1iqam0b3f597/draft',
                zoom: 14,
                center: [49.121815379295526, 55.79086830609842]
            });

            // add markers
            this.buildings.forEach(function (item) {
                var marker = new mapboxgl.Marker()
                    .setLngLat(retrieveCoordinates(item.coordinates))
                    .addTo(this.map);
                this.markers_list.push(marker);

                marker.getElement().classList.add(markerTypeOf(item.type));

                marker.getElement().innerHTML = "";

                var popup = new mapboxgl.Popup({ offset: 25, className: "marker_popup" })
                    .setText(item.title);
                marker.setPopup(popup);
            }, this);

            this.map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );
            this.map.addControl(new mapboxgl.NavigationControl());
        },
        created() {
            axios
                .get('https://web.kpfu.ru/wp-json/api/map')
                .then(response => {this.buildings = response.data; this.loading = false})
                .catch(function(e){
                        console.log(e);
                    });
        }
    }

    function markerTypeOf (value) {
        return value === "Учебные здания" ? 'markerEdu' : 'markerLive';
    }

    function showChildIfNotShown (el) {
        if (!el.classList.contains("nav-parent_active")) {
            el.classList.add("nav-parent_active");
            var panel = el.parentElement.nextElementSibling;

            panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        }
    }

    function setCheckedAllChildrenOf(parent, value){
        var arr = parent.children;
        for (var i = 0; i<arr.length; i++) {
            arr[i].children[0].children[0].checked = value;
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

    function clearOrAddAllBuildingMarkersByType(value, parent, that){
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            clearOrAddBuildingMarker(value, children[i].children[1].children[0].innerHTML, that);
        }
    }

    function clearOrAddBuildingMarker(value, name, that){
        getMarkerByBuildingName(name, that).getElement().style.opacity = value ? "1" : "0";
    }

    function getMarkerByBuildingName(name, that){
        var building_coordinates = retrieveCoordinates(that.buildings.find(function (item) {
            return item.title === name
        }).coordinates);

        return that.markers_list.find(function (item) {
            return [item.getLngLat().lng, item.getLngLat().lat].toString() === building_coordinates.toString();
        });
    }

    function retrieveCoordinates(value) {
        // noinspection RegExpSingleCharAlternation
        return value.replace(/\[|,|\]/g, "").split(" ").map(item => parseFloat(item));
    }
</script>

<style>
    @import 'mapbox-gl.css';
    @import 'uikit.min.css';
    body {
        font-family: 'PT Sans', sans-serif;
        background: #fff;
        margin: 0;
    }

    .outer_div {
        position: relative;
        min-width: 60%;
        width: 70vw;
        margin: 0 auto 0 auto;
    }
    .map_content{
        display: flex;
    }
    .towns_list {
        position: absolute;
        right: 100%;
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
        color: white;
        width: 30vw;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-flow: column nowrap;
        overflow: scroll;
        padding: 50px 45px 0px 45px;
        background-color: #00549f;
        box-sizing: border-box;
        height: 100vh;
        transition: all 0.6s ease-out;
        z-index: 1;
        background-image: url("kfu_logo.png");
        background-position: 100px 150%;
        background-repeat: no-repeat;
        background-size: 120%;
    }
    .nav-parent-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        transition: all 0.3s ease;
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
        background-color: transparent;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .nav-parent:active {
        padding: 0px;
    }
    .nav-parent > svg {
        min-width: 15px;
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
    .marker_popup {
        color: black !important;
    }
    .marker_popup .mapboxgl-popup-content {
        font-family: 'PT Sans', sans-serif;
        padding: 20px;
    }
    .map_wrapper {
        width: auto;
        flex-grow: 1;
        position: relative;
        bottom: 0;
    }
    #map {
        bottom: 0;
        left: 0;
        width: 100%;
        cursor: pointer;
        transition: width 0.6s ease-in;
        position: absolute;
    }
    .expand_button_wrapper {
        width: 0;
        overflow: visible;
        position: relative;
    }
    .expand_button {
        cursor: pointer;
        position: absolute;
        top: 50vh;
        right: -20px;
        height: 40px;
        width: 40px;
        background-color: white;
        border-radius: 50%;
        z-index: 5;
        background-image: url("right-arrow.svg");
        background-position: 55% center;
        background-repeat: no-repeat;
        background-size: 40%;
        transition: transform 0.3s ease-out;
    }
    .search_field {
        margin-top: 0;
        margin-bottom: 20px;
        background-image: url("search.png");
        background-position: 2% center;
        background-repeat: no-repeat;
        background-size: 20px;
        padding: 0 10px 0 40px;
    }
    .search_field_popup {
        color: black !important;
        margin-top: auto;
        background-color: white;
        width: 100%;
        box-sizing: border-box;
        height: auto;
        max-height: 0px;
        overflow: hidden;
        transition: max-height 0.5s ease;
    }
    .search_result_list {
        list-style: none;
        padding: 0;
        overflow: hidden;
        margin: 10px 0px;
    }
    .search_result_list > li {
        padding: 10px 20px 10px 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .search_result_list > li:hover {
        background-color: #edeff4;
    }
    .map_blocker {
        width: 100%;
        height: 100%;
        z-index: 0;
        background-color: white;
        position: relative;
    }

</style>