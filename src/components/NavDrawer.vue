<template>
    <div class="navdrawer">
        <v-navigation-drawer color="#1F8A60" mini-variant mini-variant-width="80px" absolute v-model="drawer" permanent>
            <v-avatar class="d-block text-center mx-auto my-4" size="40">
                <v-icon large class="white--text">mdi-lock</v-icon>
            </v-avatar>
            <!-- <v-list-item>
                <v-avatar class="d-block mx-auto">
                    <v-icon large class="white--text">mdi-lock</v-icon>
                </v-avatar>

                <v-list-item-title>John Leider</v-list-item-title>

                <v-btn icon @click.stop="mini = !mini">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </v-list-item> -->

            <v-divider></v-divider>

            <v-list>
                <v-list-item-group >
                    <v-list-item v-for="(item,i) in items" :key="i" active-class="border" :ripple="false">
                        <v-list-item-icon large>
                            <a :href="item.link" >
                            <v-icon color="white--text">{{ item.icon }}</v-icon>
                            </a>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            <v-spacer></v-spacer>
            <div style="bottom: 5%; position:absolute; margin-left:auto; margin-right:auto; text-align:center; left: 0%; right:0%;">
                <v-btn large icon :ripple="false">
                    <v-icon>mdi-bell</v-icon>
                </v-btn>
                <br>
                <v-avatar large>
                    <v-icon>
                        mdi-account
                    </v-icon>
                </v-avatar>
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script>
    export default {
        data() {
      return {
        drawer: true,
    items: [
    {icon: 'mdi-home-city', link: '#' },
    {icon: 'mdi-account', link:'#' },
    {icon: 'mdi-account-group-outline', link:'/new_user'},
    ],
    mini: true,
    objects: [
        {icon: 'mdi-bell'}
    ]
      }
    },
  }
</script>

<style>
    .border {
        margin-left: 12px;
        margin-right: 12px;
        background-color: #1F8A60;
        border-radius: 50%;
        text-decoration: none;
    }
    .v-list-item-group .v-list-item--active {
        color:white;
    }

</style>