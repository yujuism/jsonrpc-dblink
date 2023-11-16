export default () => ({
  dbuser: process.env.DB_USER,
  dbpassword: process.env.DB_PASSWORD,
  dbhost: process.env.DB_HOST,
  dbport: process.env.DB_PORT,
  dbname: process.env.DB_NAME,
  apiKey: process.env.API_KEY,
  elasticsearchUrl: process.env.ELASTICSEARCH_URL,
  elasticsearchUsername: process.env.ELASTICSEARCH_USERNAME,
  elasticsearchPassword: process.env.ELASTICSEARCH_PASSWORD,
  redisHost: process.env.REDIS_STORE,
  redisPort: Number(process.env.REDIS_PORT),
  redisPassword: process.env.REDIS_PASSWORD,
  logMode: process.env.LOG_MODE || 'stdout',
  nodeEnv: process.env.NODE_ENV || 'staging',
  dbmodule: process.env.DB_MODULE,
  commandMethodOverride: process.env.COMMAND_METHOD_OVERRIDE,
  queryMethodOverride: process.env.QUERY_METHOD_OVERRIDE,
});