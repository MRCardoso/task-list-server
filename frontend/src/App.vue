<template>
	<v-app>
		<task-app-sidebar />
		<task-app-loading v-if="verifyToken || loading" />
		<task-app-content />
	</v-app>
</template>

<script>

import TaskAppSidebar from './components/Sidebar.vue'
import TaskAppLoading from './components/Loading.vue'
import TaskAppContent from './components/Content.vue'
import { userKey } from '@/utils/index'

export default {
	name: "App",
	components: { TaskAppSidebar, TaskAppLoading, TaskAppContent },
	data(){
		return {
			verifyToken: true,
			loading: false,
		}
	},
	methods: {
		async validateToken() {
			this.verifyToken = true
			
			const json = localStorage.getItem(userKey)
			const user = JSON.parse(json)
			this.$store.commit("addUser", user)
			
			if(user) {
				try {
					await this.$http.post(`validateToken`, {token: user.token, userId: user.id, apiId: user.apiId})
				} catch (e) {
					this.$store.commit("addUser", null)
					this.$router.push('/')
				}
				this.verifyToken = false
			} else{
				// this.$router.push('/')
				this.verifyToken = false
			}
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