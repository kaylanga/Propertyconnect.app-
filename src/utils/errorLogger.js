const logError = (error) => {
  console.error({
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

export default logError;