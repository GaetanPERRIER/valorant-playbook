<script setup lang="ts">
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {useMainStore} from "~/store";
import Ability from "~/components/editMap/Elements/Ability.vue";

const props = defineProps({
    elementId: {
        type: Number,
        required: true,
    },
});

gsap.registerPlugin(Draggable);
const store = useMainStore();

// Variables and computed

const element = computed(() => store.mapElements.find(element => element.id === props.elementId));

// Functions

/**
 * Make the element draggable
 */
function makeDraggable() {
    const map = document.querySelector('.map');
    Draggable.create(`.ability-element, .agent-element`, {
        throwProps: true,
        bounds: map,
        edgeResistance: 1,
        cursor: "grab",

        onDragStart:function(){

        },
        onDragEnd:function(){
            DeleteOrNot(this.target);
        }
    });
}

/**
 * Delete the element if it's out of the map
 * @param el
 */
function DeleteOrNot(el : HTMLElement) {
    const translate3D = el.style.transform.match(/-?\d+\.?\d*/g);
    if (translate3D) {
        const x = parseInt(translate3D[3]);
        const y = parseInt(translate3D[4]);

        if (x > 410 && y < -400) {
            el.remove();
        }
    }
}

onMounted(() => {
    makeDraggable();
})

</script>

<template>
    <div>
        <img v-if="element && element.role !== ''" :class="element.class" :src="element.icon" :id="String(element.id)" :role="element.role" :name="element.name" alt="">
        <Ability v-else :elementId="elementId" :abilityName="element.name"/>
    </div>

</template>

<style scoped lang="scss">

.ability-element {
    width: 30px;
    height: 30px;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.65);
    position: fixed;
    top : 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:5px;
}

.agent-element {
    width: 40px;
    height: 40px;
    background-color: #4f4f4f;
    position: fixed;
    top : 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:5px;
}

</style>