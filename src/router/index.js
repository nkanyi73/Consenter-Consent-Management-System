import Vue from "vue";
import VueRouter from "vue-router";
import LandingView from "../views/LandingView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProfileView from "../views/ProfileView.vue";
import CreateUser from "../views/CreateUser.vue";
import NotificationView from "../views/NotificationView.vue";
import SubjectResponse from "../views/SubjectResponse.vue";
import ManageAccessView from "../views/ManageAccessView.vue";
import ViewUsers from "../views/ViewUsers.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: LandingView,
  },
  {
    path: "/notifications",
    name: "notifications",
    component: NotificationView,
    meta: {
      requiredAuthorization: true,
      roles: ['1', '3'],
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
    meta: {
      requiredAuthorization: true,
      roles: ['1']
    }
  },
  {
    path: "/myhome",
    name: "client_home",
    component: SubjectResponse,
    meta: {
      requiredAuthorization: true,
      roles: ['2'],
    },
  },
  {
    path: "/manageAccess",
    name: "manage_access",
    component: ManageAccessView,
    meta: {
      requiredAuthorization: true,
      roles: ['2'],
    },
  },
  {
    path: "/manageUsers",
    name: "manage_users",
    component: ViewUsers,
    meta: {
      requiredAuthorization: true,
      roles: ['1'],
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiredAuthorization: true,
      roles: ['1'],
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: {
      requiredAuthorization: true,
      roles: ['2'],
    },
  },
  {
    path: "/new_user",
    name: "newUser",
    component: CreateUser,
    meta: {
      requiredAuthorization: true,
      roles: ['1'],
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const role = localStorage.role;
  if (to.meta.requiredAuthorization) {
    if (to.meta?.roles?.includes(role)) {
      next();
    } else {
      alert("You are not allowed to view this page");
      router.back();
    }
  } else {
    next();
  }
});

export default router;
