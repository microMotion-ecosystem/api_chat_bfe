module.exports = {
    apps: [
      {
        name: 'api_chat_bfe:5513 ',
        script: 'node ./dist/main.js',
        cwd: '/home/fuse_admin/repos_chat/api_chat_bfe',
        env: {
          NODE_ENV: 'production',
          PORT: 5513,
        },
      },
    ],
  };
  