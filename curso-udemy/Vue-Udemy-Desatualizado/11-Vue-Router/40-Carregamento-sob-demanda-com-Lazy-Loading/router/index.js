import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import Contatos from '../views/contatos/ContatosView.vue'
// import ContatoDetalhes from '../views/contatos/ContatoDetalhes.vue'
// import ContatoEditar from '../views/contatos/ContatoEditar.vue'
// import ContatosHome from '../views/contatos/ContatosHome.vue'
import Error404View from '../views/Error404View.vue'
import Error404Contatos from '../views/contatos/Error404Contatos.vue'
// import LoginView from '../views/login/LoginView.vue'

const HomeView = () => import('../views/HomeView.vue') // Analogamente podemos aplicar a propriedade de lazy loading para o Home
const Contatos = () => import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatosView.vue') // É a forma de trabalhar com lazy loading com vue router
const ContatoDetalhes = () => import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatoDetalhes.vue')
const ContatoEditar = () => import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatoEditar.vue')
const ContatosHome = () => import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatosHome.vue')

const extrairParametroId = route => {
  return {
    id: +route.params.id
  }
}

const routes = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/contatos',
    // path: '/meus-contatos',
    name: 'Contatos',
    alias: ['/meus-contatos', '/lista-de-contatos'],
    // component: Contatos,
    // component: () => Promise.resolve({ template: '' }), // É um recurso de component assíncrono de Vue
    component: Contatos,
    props: (route) => {
      const busca = route.query.busca
      return busca ? { busca } : {}
    },
    children: [
      // {
      //   path: 'teste', // meus-contatos.com/contatos/teste
      //   component: ContatoEditar
      // },
      // {
      //   path: ':id', // meus.contatos.com/contatos/1, 2 ou 3
      //   component: ContatoDetalhes,
      //   name: 'contato',
      //   props: true
      // },
      // {
      //   path: ':id', // meus.contatos.com/contatos/1, 2 ou 3
      //   component: ContatoDetalhes,
      //   name: 'contato',
      //   props: {
      //     id: 10
      //   }
      // },
      {
        path: ':id(\\d+)', // meus.contatos.com/contatos/1, 2 ou 3
        component: ContatoDetalhes,
        name: 'contato',
        props: extrairParametroId
      },
      // {
      //   path: 'teste', // meus-contatos.com/contatos/teste
      //   component: ContatoEditar
      // },
      {
        // path: ':id(\\d+)/editar/:opcional?', // meuns-contatos.com/contatos/2/editar
        // path: ':id(\\d+)/editar/:zeroOuMais*',
        // path: ':id(\\d+)/editar/:umOuMais+',
        path: ':id(\\d+)/editar',
        alias: ':id(\\d+)/alterar',
        meta: { requerAutenticacao: true },
        beforeEnter(to, from, next) {
          console.log('beforeEnter')
          // if (to.query.autenticado === 'true') {
          //   // next()
          //   // return
          //   return next()
          // }
          // next('/contatos')
          next() // contunuar
          // next(true) // Acontece o mesmo de cima
          // next(false) // bloqueia a navegação
          // next('/contatos') // Funciona como uma forma de redirecionar
          // next({
          //   path: '/contatos'
          // }) // redireciona tbm
          // next({ name: 'contatos' }) // redireciona tbm
          // next(new Error(`PErmissões insuficiente para acessar o recurso ${to.fullPath}`))
        },
        components: {
          default: ContatoEditar,
          'contato-detalhes': ContatoDetalhes
        },
        // props: {
        //   default: true,
        //   'contato-detalhes': true
        // }
        props: {
          default: extrairParametroId,
          'contato-detalhes': extrairParametroId
        }
      },
      {
        path: '',
        component: ContatosHome,
        name: 'contatos'
      },
      {
        path: '/contatos/:pathMatch(.*)*',
        component: Error404Contatos
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  // {
  //   path: '/login',
  //   component: LoginView
  // },
  // {
  //   path: '/contatos', redirect: '/meus-contatos'
  // },
  // {
  //   path: '/', redirect: '/contatos'
  // }
  // {
  //   path: '/', redirect: { name: 'contatos' }
  // }
  {
    path: '/', redirect: () => {
      return '/contatos'
      // return {
      //   name: 'contatos'
      // }
    }
  },
  // {
  //   path: '/contatos/:id', // meus.contatos.com/contatos/1, 2 ou 3
  //   component: ContatoDetalhes
  // }
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/contatos'
  // }
  // {
  //   path: '/contatos/:pathMatch(.*)*',
  //   component: Error404Contatos
  // },
  {
    path: '/:pathMatch(.*)*',
    component: Error404View
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(()=> {
        if (savedPosition) {
          return resolve(savedPosition)
        }
        if(to.hash) {
          // o hash (parametros) definido no ContatoDetalhes
          return resolve({
            selector: to.hash,
            offset: {x: 0, y: 0}
          })
        }
        return resolve({x: 0, y: 0})
      }, 3000)
    })
    // if (savedPosition) {
    //   return savedPosition
    // }
    // if(to.hash) {
    //   // o hash (parametros) definido no ContatoDetalhes
    //   return {
    //     selector: to.hash,
    //     offset: {x: 0, y: 0}
    //   }
    // }
    // return { x: 0, y: 250 }
  }
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  console.log('Requer autenticação', to.meta.requerAutenticacao)
  next() // Sempre é necessário chamar esse next no uso de guarda de rotas
})

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve')
  next()
})

router.afterEach(() => {
  console.log('afterEach')
})

router.onError((erro) => {
  console.log(erro)
})

export default router
