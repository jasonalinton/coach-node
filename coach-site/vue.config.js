module.exports = {
  devServer: { port: 8080 },
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true,
      lintGQL: true
    }
  }
}
