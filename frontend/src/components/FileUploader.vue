<template>
    <div class="uploader-content">
        <input type="file" v-show="false" id="file" ref="file" @change="handleFileUpload()"/>
        <transition name="flip" mode="out-in">
            <div class="uploader-file" v-if="file || hasImage">
                <div class="uploader-file-actions">
                    <v-tooltip bottom class="mr-2">
                        <template #activator="data">
                            <v-icon class="red--text action-remove" v-on="data.on" @click="remove">fa fa-times-circle</v-icon>
                        </template>
                        <span>Remover</span>
                    </v-tooltip>
                </div>
                <span v-if="file">
                    <img ref="image" width="100">
                    <v-progress-linear v-model="progress"></v-progress-linear>
                </span>
                <img v-else-if="hasImage" :src="images[0].url" width="100">
            </div>

            <div v-else class="uploader-button" @click="$refs.file.click()">
                <v-icon right dark>cloud_upload</v-icon>
                Upload
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['images'],
    computed: {
        progress(){
            return this.$store.state.uploader.progress
        },
        file(){
            return this.$store.state.uploader.file
        },
        hasImage(){
            return Array.isArray(this.images) && this.images.length > 0
        }
    },
    watch: {
        images(val){
            this.images = val
        }
    },
    data() {
        return {
            showImages: true
        }
    },
    methods: {
        remove(){
            if(this.$refs.image){
                this.$refs.image.src = null
            }
            this.$emit('detachImage')
            this.$store.commit('addFile', null)
        },
        handleFileUpload(){
            this.$store.commit('addFile', this.$refs.file.files[0])
            this.imagePreview()
        },
        imagePreview() {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.$refs.image.src = e.target.result
            }

            reader.readAsDataURL(this.$store.state.uploader.file);
        }
    },
    created() {
        this.$store.commit('resetInstance')
    },
}
</script>
<style>
    .uploader-content{
        box-shadow: 0 2px 8px #000;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .uploader-content img{
        width: 100%;
        height: 100%;
    }
    .uploader-button{
        width: 100%;
        padding: 40px 0;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: #fff;
        background-color: #7986CB;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .uploader-button:hover{
        background-color: #9FA8DA;
    }
    .uploader-file{
        margin: 4px;
    }
    .uploader-file-actions .action-remove{
        float: left;
    }
    .uploader-file-actions .action-save{
        float: right;
    }
</style>