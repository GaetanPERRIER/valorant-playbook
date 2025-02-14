<script setup lang="ts">
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {useMainStore} from "~/store";
import {ref, computed, nextTick} from "vue";

gsap.registerPlugin(Draggable);
const store = useMainStore();

interface Agent {
    name : string;
    class: string;
    id: number;
    role: string;
    icon: string;
    abilities: { id: number, name: string, icon: string }[];
}

// Variables and computed

let mapElementId = ref(0);
let selectedRole = ref('duelist');

const agentsToDisplay = computed(() => store.agents.filter(agent => agent.role === selectedRole.value));
const roles = computed(() => store.roles);
const abilities = computed(() => store.abilitiesName);

// Functions

/**
 * Add an element to the map by clicking on it
 * @param event
 */
function addElementToMap(event : MouseEvent) {
    const data = {
        name: (event.target as HTMLImageElement).alt,
        class: `${(event.target as HTMLImageElement).alt} ${abilities.value.includes((event.target as HTMLImageElement).alt) ? 'ability-element' : 'agent-element'}`,
        id: mapElementId.value++,
        role: (event.target as HTMLImageElement).id,
        icon: (event.target as HTMLImageElement).src,
        abilities: []
    }

    store.addMapElement(data);
    console.log(store.mapElements);
}

/**
 * Show agent abilities by right-clicking on it
 * @param event
 */
function showAgentAbilities(event : MouseEvent) {
    event.preventDefault();
    resetAbilities();

    const nextSibling = (event.target as HTMLElement).nextElementSibling;
    if (nextSibling && nextSibling instanceof HTMLElement) {
        nextSibling.style.width = '100%';
        nextSibling.style.zIndex = '100';
    }
}

/**
 * Reset abilities to hide them
 */
function resetAbilities(){
    document.querySelectorAll('.abilities').forEach(ability => {
        (ability as HTMLElement).style.width = '0';
        (ability as HTMLElement).style.zIndex = '0';
    })
}

/**
 * Select a role
 * @param event
 */
function selectRole(event : MouseEvent) { selectedRole.value = (event.target as HTMLImageElement).id;}

onMounted(() => {
    window.addEventListener('click', resetAbilities);
})


</script>

<template>
    <div class="menu-agent">
        <div class="grille-agents role u-mb10">
            <img @click="selectRole" v-for="role in roles" :src="role.icon" class="role-icon u-p10 w100" :id="role.rolename" :alt="role.rolename">
        </div>
        <div class="grille-agents">
            <div v-for="agent in agentsToDisplay" class="u-flex agent u-relative w100">
                <img class="w100" @click="addElementToMap"  :src="agent.icon" :id="agent.role" :alt="agent.name" typeofelement="agent" draggable="false" @contextmenu="showAgentAbilities" >
                <div class="u-flex abilities u-flex-direction-column u-justify-content-center u-align-items-center w0px">
                    <img @click="addElementToMap" class="u-p15 w100" v-for="ability in agent.abilities" :src="ability.icon" :alt="ability.name">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.menu-agent {
    .grille-agents {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: repeat(4, 1fr);

        .role-icon {
            background-color: #2d2d2d;
            cursor: pointer;
            border-radius: 5px;
        }

        .agent {
            cursor: pointer;
            background-color: #4f4f4f;
            border-radius:5px;
            transition: all 200ms cubic-bezier(.4,0,.2,1);

            &:hover {
                background-color: #757575;
            }
        }

        .abilities {
            overflow: hidden;
            position: absolute;
            top: 100%;
            left: 50%;
            border-radius: 5px;
            transform: translate( -50%, 0);

            img {
                background-color: #757575;
                transition: all 150ms cubic-bezier(.4,0,.2,1);

                &:hover {
                    background-color: #949494;
                }
            }
        }
    }
}

</style>