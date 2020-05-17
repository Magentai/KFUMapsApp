<template>
    <ul class="towns_list">
        <li v-for="city in cities" :key="city.name" >{{city.name}}</li>
    </ul>
</template>

<script>
    var data = {
        cities : [{id: 0, name: "Казань", center: [49.121815379295526,55.79086830609842]}, {id: 1, name: "Н. Челны", center: [52.40073983330103, 55.74134240544038]}, {id: 2, name: "Елабуга", center: [52.05435872588566, 55.757598796312465]}, {id: 3, name: "Чистополь", center: [50.63665252982105, 55.37135945884043]}] }

    export default {
        name: "List",
        data: data
    }
</script>

<style scoped>

</style>

