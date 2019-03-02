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
import { userKey, browserData } from '@/utils/index'

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
				let user = this.$store.state.auth.user
				let { name, version } = browserData()

				try {
					let res = await this.$http.post(`refrashToken`, {
						id: user.id,
						PlatformName:name,
						PlatformVersion: version,
						keepLogin: user.keepLogin
					})
					if(res.data.updated){
						this.dialog = false
						return this.$store.commit("addUser", res.data.updated)
					}
				} catch (error) {/* Has error in refrash re-auth, set logout */}
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

	/* #app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas:
			"header header"
			"menu content"
			"menu footer";
	}

	#app.hide-menu {
		grid-template-areas:
			"header header"
			"content content"
			"footer footer";
	} */
</style>