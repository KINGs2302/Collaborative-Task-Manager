import app from './app';

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  import('http').then(({ default: http }) => {
    import('./socket/socket').then(({ initSocket }) => {
      import('./config/db').then(({ connectDB }) => {
        const server = http.createServer(app);
        connectDB();
        initSocket(server);
        server.listen(process.env.PORT || 5000, () => {
          console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
      });
    });
  });
}
