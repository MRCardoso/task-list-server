<template>
	<v-app>
		<task-app-sidebar />
		<task-app-loading v-if="verifyToken || loading" />
		<task-app-content />
		<task-app-modal :dialog="dialog" @confirmDialog="redoLogin" title="Refazer o login" content="Deseja restaurar sua sessão?" />
	</v-app>
</template>

<script>

import TaskAppSidebar from './components/Sidebar.vue'
import TaskAppLoading from './components/Loading.vue'
import TaskAppContent from './components/Content.vue'
import TaskAppModal from '@/components/Modal.vue'
import { userKey } from '@/utils/index'

export default {
	name: "App",
	components: { TaskAppSidebar, TaskAppLoading, TaskAppContent, TaskAppModal },
	data(){
		return {
			verifyToken: true,
			dialog: false,
			loading: false,
		}
	},
	computed: {
		user(){
            return this.$store.state.auth.user;
        },
	},
	methods: {
		async redoLogin(confimation){
			if(confimation){
				this.loading = false
				this.verifyToken = false
				let updated = await this.$store.dispatch('redoLogin')
				if(updated){
					this.dialog = false
					this.$store.commit("addUser", updated)
					return
				}
			}

			this.$store.commit("addUser", null)
			this.$router.push('/')
			this.dialog = false
			this.loading = false
			this.verifyToken = false
		},
		async validateToken() {
			this.verifyToken = true
			
			const json = localStorage.getItem(userKey)
			const user = JSON.parse(json)
			this.$store.commit("addUser", user)
			
			if(user) {
				try {
					let res = await this.$store.dispatch("verifyToken", user.authToken.token)
					if(!res.data.user.status){
						this.$store.commit("addUser", null)
						this.$router.push('/')
					} else{
						this.$store.commit('refrashInfo', {id: user.id, admin: res.data.user.admin})
					}
				} catch (e) {
					if(user.status){
						this.dialog = true
					} else{
						this.$store.commit("addUser", null)
						this.$router.push('/')
					}
				}
			}
			this.verifyToken = false
		}
	},
	created() {
		this.$store.dispatch('busListenLoading', (value) => this.loading = value)
		this.$store.dispatch('busListenDialog', (value) => this.dialog = value)
		this.validateToken()
	}
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}
</style>