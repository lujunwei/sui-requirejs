({
  baseUrl: './www/',
  dir: "./dist/",
  paths: {
    zepto: 'lib/sui/js/zepto.min',
    sm: 'lib/sui/js/sm.min',
    'smExtend': 'lib/sui/js/sm-extend.min',
    'view': "js/view"
  },
  shim: {
    'zepto': {
      exports: '$'
    },
    'sm': {
      deps: ['zepto'],
      exports: 'sm'
    },
    'smExtend': {
      deps: ['zepto', 'sm'],
      exports: 'smExtend'
    }
  },
  optimize: "uglify",
  modules: [{
    name: 'js/sui-requirejs'
  }, {
    name: 'js/demos'
  }, {
    name: 'js/login'
  }, {
    name: 'js/registe'
  }]
})