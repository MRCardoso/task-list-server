<template>
    <transition name="flip" mode="out-in">
        <div v-if="hasImage()" key="image" class="uploader-image" :style="imageContent">
            <div class="uploader-file-actions fixed">
                <v-tooltip bottom class="mr-2">
                    <template #activator="data">
                        <v-icon class="red--text action-remove" v-on="data.on" @click="remove">fa fa-times-circle</v-icon>
                    </template>
                    <span>Remover</span>
                </v-tooltip>
            </div>
        </div>
        <div v-else-if="uploaded" key="edit" class="uploader-add-file">
            <div class="uploader-file-actions">
                <v-tooltip bottom class="pr-2">
                    <template #activator="data">
                        <v-icon class="red--text action-remove" v-on="data.on" @click="remove">fa fa-times-circle</v-icon>
                    </template>
                    <span>Remover</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template #activator="data">
                        <v-icon class="blue--text action-crop" v-on="data.on" @click="crop">fa fa-cut</v-icon>
                    </template>
                    <span>Cortar</span>
                </v-tooltip>
            </div>
            <clipper-basic class="uploader-crop" ref="clipper" :src="uploaded"></clipper-basic>
            <v-progress-linear v-model="progress"></v-progress-linear>
        </div>
        <div v-else class="uploader-file-content" key="upload" @click="$refs.file.click()">
            <input type="file" v-show="false" ref="file" @change="upload($event)">
            <v-icon right dark>cloud_upload</v-icon>
            Upload
        </div>
    </transition>
</template>

<script>
export default {
    props: ['image'],
    computed: {
        progress(){
            return this.$store.state.uploader.progress
        },
        file(){
            return this.$store.state.uploader.file
        },
        imageContent(){
            if(this.hasImage()){
                return {
                    backgroundImage: `url('${this.image.url}')`,
                    backgroundSize: `100% 100%`
                }
            }
            return {}
        }
    },
    watch: {
        image(val){
            this.image = val
            this.allowUpload = this.hasImage() ? false : true
        }
    },
    data() {
        return {
            uploaded: null,
        }
    },
    methods: {
        hasImage(){
            return (this.image ? true : false)
        },
        upload: function(e){
            let file = null
            if (e.target.files.length !== 0) {
                if(this.uploaded) URL.revokeObjectURL(this.uploaded)
                this.uploaded = window.URL.createObjectURL(e.target.files[0]);
                file = e.target.files[0]
            }
            this.$store.commit('addFile', file)
        },
        crop: function () {
            this.$refs.clipper.clip().toBlob(blob => {
                if(this.uploaded) URL.revokeObjectURL(this.uploaded)
                this.uploaded = URL.createObjectURL(blob)
                this.$store.commit('addFile', blob)
            })
        },
        remove(){
            this.uploaded = null
            this.$emit('detachImage')
            this.$store.commit('addFile', null)
        }
    },
    created() {
        this.$store.commit('resetInstance')
    },
}
</script>
<style>
    .uploader-image{
        position: relative;
        width: 320px;
        height: 280px;
        box-shadow: 0 2px 8px #000;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .uploader-add-file{
        width: 100%;
        padding-top: 4px;
        padding-left: 4px;
        box-shadow: 0 2px 8px #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .uploader-file-content{
        width: 100%;
        padding: 40px 0;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: #fff;
        background-color: #7986CB;
        box-shadow: 0 2px 8px #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .uploader-file-content:hover{
        background-color: #9FA8DA;
    }
    .uploader-file-actions{
        width: 100%;
        display: flex;
        justify-content: flex-start;
    }
    .action-crop, .action-remove{
        opacity: 1;
    }
    .action-remove:hover, .action-crop:hover{
        opacity: 0.8;
    }
</style>