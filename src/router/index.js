import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import CreateUser from '../views/CreateUser.vue'
import NotificationView from '../views/NotificationView.vue'
import SubjectResponse from '../views/SubjectResponse.vue'
// import  firebase  from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// eslint-disable-next-line
import { db } from '../firebase'
// import LoaderView from '../components/LoaderView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingView
  },
  {
    path:'/notifications',
    name: 'notifications',
    component: NotificationView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/myhome',
    name: 'client_home',
    component: SubjectResponse
  },
   {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
      meta: {
        authRequired: true
      },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
      meta: {
        authRequired: true
      },
  },
  {
    path: '/new_user',
    name: 'newUser',
    component: CreateUser,
      meta: {
        authRequired: true
      },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert('You must be logged in to see this page');
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});

export default router
