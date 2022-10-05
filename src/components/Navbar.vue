<template>
    <div class="landing">
        <v-app-bar class="teal darken-3" app>
            <v-icon class="mr-2 white--text">mdi-lock</v-icon>

            <v-toolbar-title class="font-weight-medium text-uppercase white--text">Consenter</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-btn v-for="item in items" :key="item.title" router :to="item.route" depressed
                    class="white--text teal darken-3">
                    {{item.title}}
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>


            <v-btn router :to="login" class="ma-2 white--text font-weight-medium text-uppercase" outlined>
                Sign In
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
export default {
name: 'NavBar',
data() {
    return {
        drawer: false,
        items: [
            { title: 'Home'},
            { title: 'About'},
        ],
        login: '/login'
    }
}
}
</script>