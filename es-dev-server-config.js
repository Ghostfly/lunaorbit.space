module.exports = {
    port: 8080,
    watch: true,
    nodeResolve: true,
    plugins: [],
    moduleDirs: ['node_modules'],
    middlewares: [
        function rewriteIndex(context, next) {
          if (context.url === '/' || context.url === '/index.html') {
            context.url = '/dev/index.html';
          }
    
          return next();
        },
      ],
  };