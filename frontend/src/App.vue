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
	methods: {
		async redoLogin(confimation){
			if(confimation){
				let updated = await this.$store.dispatch('redoLogin')
				if(updated){
					this.dialog = false
					this.$store.commit("addUser", updated)
					return window.location.reload()
				}
			}

			this.$store.commit("addUser", null)
			this.$router.push('/')
			this.dialog = false
		},
		async validateToken() {
			this.verifyToken = true
			
			const json = localStorage.getItem(userKey)
			const user = JSON.parse(json)
			this.$store.commit("addUser", user)
			
			if(user) {
				try {
					await this.$http.post(`validateToken`, {token: user.token, userId: user.id, apiId: user.apiId})
				} catch (e) {
					if(user.keepLogin){
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