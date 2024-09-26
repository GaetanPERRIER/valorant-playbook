<script setup lang="ts">

</script>

<template>
    <div class="index-component u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
        <div class="title-container">
            <h1 class="playbook-title fs35px">Create and personalize your own Valorant playbook</h1>
            <NuxtLink to="edit"> <p>Start now</p> </NuxtLink>
        </div>

    </div>
</template>

<style scoped lang="scss">

.index-component {
    margin: 50px;
    height: 100%;

    .title-container{
        margin: 15px 0;
        .playbook-title {
            text-align: center;
            text-transform: uppercase;
        }

        p {
            text-align: center;
        }
    }
}
</style>