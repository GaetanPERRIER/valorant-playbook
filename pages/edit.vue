<script setup lang="ts">
import { useMainStore} from "~/store";
import { ref } from 'vue'
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';


gsap.registerPlugin(Draggable);

const store = useMainStore();
interface Agent {
    name : string;
    src: string;
    class: string;
    id: string;
    abilities: { id: number, name: string, icon: string }[];
}

// Variables et constantes

let selectedRole = ref('duelist');
const elements = ref<Agent[]>([]);


// Zoom
const zoom = {
    mapZoom: 0.9,
    mapZoomMax: 2.75,
    mapZoomMin: 0.9,
    zoomScale: 0.2
}


// Variable calculés

const agentsToDisplay = computed(() => store.agents.filter(agent => agent.role === selectedRole.value));
const roles = computed(() => store.roles);
const abilities = computed(() => store.abilitiesName);


// Mounted

onMounted(() => {
    store.setAgentsAndAbilities();
    store.setRoles()
})

// Add an agent to the map
function addElementToMap(event : MouseEvent) {
    const map = document.querySelector('.map');
    const data = {
        name: (event.target as HTMLImageElement).alt,
        src: `${(event.target as HTMLImageElement).src}`,
        class: `${(event.target as HTMLImageElement).alt} ${abilities.value.includes((event.target as HTMLImageElement).alt) ? 'ability-element' : 'agent-element'}`,
        id: elements.value.length.toString(),
        abilities: []
    }

    elements.value.push(data);

    // On the next tick, we can access the elements in the DOM otherwise it will be undefined
    nextTick(() => {
        elements.value.forEach(el => {
            Draggable.create(`.ability-element, .agent-element`, {
                throwProps: true,
                bounds: map,
                edgeResistance: 1,
                cursor: "grab",

                onDragStart:function(){
                    if (Draggable.get('.map')) Draggable.get('.map').disable();
                },
                onDragEnd:function(){

                    DeleteOrNot(el);
                }
            });
        })
    })
}

function DeleteOrNot(target : Agent) {
    console.log(target.class);
    const el = document.getElementById(target.id);
    console.log(el)
}

// Select a role by clicking on images
function selectRole(event : MouseEvent) { selectedRole.value = (event.target as HTMLImageElement).id; }
function cancelZoom(event: WheelEvent) { event.preventDefault(); }

// Handle right click en agents to show abilities
function showAgentAbilities(event : MouseEvent) {
    event.preventDefault();
    resetAbilities();

    const nextSibling = (event.target as HTMLElement).nextElementSibling;
    if (nextSibling && nextSibling instanceof HTMLElement) {
        nextSibling.style.width = '100%';
        nextSibling.style.zIndex = '100';
    }
}

// Reset abilities displaying while left-clicking
function resetAbilities(){
    document.querySelectorAll('.abilities').forEach(ability => {
        (ability as HTMLElement).style.width = '0';
        (ability as HTMLElement).style.zIndex = '0';
    })
}

// Zoom on the map
function zoooMap(event: WheelEvent) {
    const map = document.querySelector('.map') as HTMLElement;
    if (event.deltaY < 0 && zoom.mapZoom === zoom.mapZoomMax) return;

    Draggable.create(map, {
        type: 'x,y',
        bounds: '.map-container',
        edgeResistance: 0.9,
        cursor: 'default',
    });

    zoom.mapZoom += zoom.zoomScale * (event.deltaY > 0 ? -1 : 1);
    if (zoom.mapZoom <= zoom.mapZoomMin) {
        map.style.transform = 'scale(0.9)';
        Draggable.get(map).kill();
        return;
    }

    zoom.mapZoom = Math.min(Math.max(zoom.mapZoom, zoom.mapZoomMin), zoom.mapZoomMax);

    gsap.to(map, {
        duration: 0,
        scale: zoom.mapZoom,
        transformOrigin: `50% 50%`
    });
}


</script>

<template>
    <div class="edit-container u-flex u-align-items-center u-justify-content-center" @click="resetAbilities" @wheel="cancelZoom">
        <div class="sidebar w25 h100 u-p20">
            <div class="menu-agent">
                <div class="grille-agents role u-mb10">
                    <img @click="selectRole" v-for="role in roles" :src="role.icon" class="role-icon u-p10 w100" :id="role.rolename" :alt="role.rolename">
                </div>
                <div class="grille-agents">
                    <div v-for="agent in agentsToDisplay" class="u-flex agent u-relative w100">
                        <img class="w100" @click="addElementToMap"  :src="agent.icon" :id="agent.role" :alt="agent.name" draggable="false" @contextmenu="showAgentAbilities" >
                        <div class="u-flex abilities u-flex-direction-column u-justify-content-center u-align-items-center w0px">
                            <img @click="addElementToMap" class="u-p15 w100" v-for="ability in agent.abilities" :src="ability.icon" :alt="ability.name">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="map-container w50 h100 u-relative dropzone" id="map-container" @wheel="zoooMap">
            <div class="map u-noselect w100 h100" draggable="false" @wheel="zoooMap">
                <img v-for="el in elements" :class="el.class" :src="el.src"  :id="el.id" alt="">

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
    }

    .map-container {
        overflow: hidden;
        z-index: 9999;

        .map {
            transform: scale(0.9);
            background-image: url("../static/imgs/maps/sunset.png");
            background-size: cover;
        }

        .ability-element {
            width: 20px;
            height: 20px;
            padding: 2px;
            background-color: rgba(0, 0, 0, 0.65);
            position: fixed;
            top : 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius:5px;
        }

        .agent-element {
            width: 30px;
            height: 30px;
            background-color: #4f4f4f;
            position: sticky;
            top : 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius:5px;
        }
    }
}

</style>