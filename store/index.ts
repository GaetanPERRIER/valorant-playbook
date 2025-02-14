import { defineStore } from 'pinia'

interface Agent {
    id: number
    name: string
    role: string
    icon: string
    abilities: { id: number, name: string, icon: string }[]
}

interface Role {
    id: number
    rolename: string
    icon: string
}


export const useMainStore = defineStore('main', {
    state: () => ({
        agents:[] as Agent[],
        roles:[] as Role[],
        abilitiesName : [] as string[],
        mapElements:[] as Agent[],
    }),

    actions: {
        async setAgentsAndAbilities() {
            const agents = await import('@/static/data/agents.json')
            this.agents = agents.default

            agents.default.forEach(agent => {
                agent.abilities.forEach(ability => {
                    this.abilitiesName.push(ability.name)
                })
            })
        },

        async setRoles() {
            const roles = await import('@/static/data/roles.json')
            this.roles = roles.default
        },

        addMapElement(agent: Agent) {
            this.mapElements.push(agent)
            //localStorage.setItem('mapElements', JSON.stringify(this.mapElements))
        },

        setMapElements() {
            /*if (localStorage.getItem('mapElements')) {
                this.mapElements = JSON.parse(localStorage.getItem('mapElements')!)
            }
            */
        },
    },
})

