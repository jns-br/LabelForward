module.exports = {
    node_port: process.env.NODE_PORT,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,
    jwtSecret: process.env.JWT_SECRET,
    batchSize: process.env.BATCH_SIZE,
    uncertaintyThreshold: process.env.UNCERTAINTY_THRESHOLD,
    activeLearning: process.env.ACTIVE_LEARNING
  };