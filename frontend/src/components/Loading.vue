<template>
    <div class="loading">
        <img src="@/assets/loading.gif" alt="Loading">
    </div>
</template>

<script>
export default {
    name: "Loading"
}
</script>

<style>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0 !important;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgba(10,23,55,0.5);
}
.loading > img{
    width: 100px;
    position: absolute;
    left: 45%;
    top: 40%;
}
</style>
