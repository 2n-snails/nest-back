module.exports = {
  apps: [
    {
      name: 'nest-back',
      script: './dist/main.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
