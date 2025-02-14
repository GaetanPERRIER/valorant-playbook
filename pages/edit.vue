<script setup lang="ts">
import { useMainStore} from "~/store";
import AgentsMenu from "~/components/editMap/AgentsMenu.vue";
import MapElement from "~/components/editMap/MapElement.vue";

// Variables and computed
const store = useMainStore();
const mapElements = computed(() => store.mapElements);

// Functions

function cancelZoom(event: WheelEvent) { event.preventDefault(); }

// Mounted

onMounted(() => {
    store.setAgentsAndAbilities();
    store.setRoles()
    store.setMapElements()
})


</script>


<template>
    <div class="edit-container u-flex u-align-items-center u-justify-content-center" @wheel="cancelZoom">
        <div class="sidebar w25 h100 u-p20">
            <AgentsMenu/>
        </div>
        <div class="map-container w50 h100 u-relative dropzone" id="map-container">
            <div class="map u-noselect w100 h100" draggable="false">
                <div class="button-delete"></div>
                <MapElement v-for="element in mapElements" :elementId="element.id"/>
            </div>
        </div>
        <div class="sidebar w25 h100">

        </div>
    </div>
</template>

<style scoped lang="scss">

.edit-container {
    overflow: hidden;
    background-color: #1d1d1d;
    height: 100vh;
    width: 100vw;

    .sidebar {
        overflow: hidden;
    }

    .map-container {
        overflow: hidden;
        position: relative;

        .button-delete {
            width: 60px;
            height: 60px;
            background-color: red;
            position: fixed;
            top: 15px;
            right: 15px;
        }

        .map {
            transform: scale(0.9);
            background-image: url("../static/imgs/maps/sunset.png");
            background-size: cover;
        }

    }
}

</style>