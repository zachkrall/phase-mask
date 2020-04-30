import '~/css/toolbar.css'
import Vue from 'vue/dist/vue.common.js'

global.toolbar = new Vue({
  el: '#toolbar',
  data: {
    camera: {
      class: 'red',
      text: 'Camera Disabled'
    },
    model: {
      class: 'red',
      text: 'Loading Face Model...'
    },
    faceVisible: false
  },
  methods: {
    replEval() {
      window.replEval()
    }
  }
})
