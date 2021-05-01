module.exports = {
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    purge: {
        options: {
            keyframes: true,
        },
        content:[
            './src/*.ejs',
            './src/**/*.ts',
            './src/**/**/*.ts',
        ]
    },
    variants: {},
    plugins: [],
  }