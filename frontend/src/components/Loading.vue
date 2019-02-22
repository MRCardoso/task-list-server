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
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    z-index: 2;
    width: 100%;
    height: 100vh;
    background-color: rgba(10,23,55,0.5);
}
.loading > img{
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
