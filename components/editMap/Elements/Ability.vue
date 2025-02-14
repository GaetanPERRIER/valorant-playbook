<script setup lang="ts">
import {useMainStore} from "~/store";

const props = defineProps({
    elementId: {
        type: Number,
        required: true,
    },
    abilityName: {
        type: String,
        required: true,
    }
});

const store = useMainStore();

// Variables and computed

const ability = computed(() => store.mapElements.find(element => element.id === props.elementId));


// Functions



onMounted(() => {
})

</script>

<template>
    <img v-if="ability" :src="ability.icon" :alt="ability.name" :class="ability.class" draggable="false">
</template>

<style scoped lang="scss">

</style>