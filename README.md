# Docker Container Name

An optimized Docker container designed for seamless execution of Sequelize, enabling swift and efficient database operations within Node.js environments.

## Getting Started

### Prerequisities

In order to run this container you'll need docker installed.

- [Windows](https://docs.docker.com/windows/started)
- [OS X](https://docs.docker.com/mac/started/)
- [Linux](https://docs.docker.com/linux/started/)

### Usage

#### Container Parameters

Run the container

```shell
docker run \
  -e API_KEY=[API_KEY_FOR_AUTH] \
  -e DB_USER=[db_user] \
  -e DB_PASSWORD=[db_password] \
  -e DB_NAME=[db_name] \
  -e DB_HOST=[db_bost] \
  -e DB_PORT=[db_port] \
  -e REDIS_STORE=[redis_host] \
  -e REDIS_PORT=[redis_port] \
  -e REDIS_PASSWORD=[redis_password] \
  -e DB_MODULE=[database_package_module] \
  -p [external_port]:3000 \
  -d \
  jsonrpc-dblink:latest
```

Docker compose example

```yaml
version: '3'
services:
  - redis:
    container_name: redis
    image: redis:7.0.4-alpine
    restart: always
    ports:
      - ${RD_PORT}:6379
    command: redis-server --save 20 1 --loglevel warning --requirepass ${RD_PASSWORD}
    volumes:
      - ./cache:/data
    networks:
      - dblink-net

  postgres:
    container_name: postgres
    image: postgres:14.5-alpine
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - ${POSTGRES_PORT}:5432
    volumes:
      - ./postgres:/var/lib/postgresql/data
    networks:
      - dblink-net

  dblink:
    container_name: dblink
    image: yujuism/jsonrpc-dblink:latest
    ports:
      - '3002:3000'
    environment:
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - API_KEY=${API_KEY}
      - REDIS_STORE=${REDIS_STORE}
      - REDIS_PORT=${REDIS_PORT}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - DB_MODULE=${DB_MODULE}
      - DB_EXTENSIONS=${DB_EXTENSIONS}
    depends_on:
      - redis
      - postgres
    networks:
      - dblink-net

networks:
  dblink-net:
```

#### Environment Variables

- `PORT` - Custom internal port
- `API_KEY` - API Key for jsonrpc-dblink
- `ELASTICSEARCH_URL` - Elasticsearch URL
- `ELASTICSEARCH_USERNAME` - Elasticsearch Username
- `ELASTICSEARCH_PASSWORD` - Elasticsearch Password
- `REDIS_STORE` - Redis hostname
- `REDIS_PORT` - Redis port
- `REDIS_PASSWORD` - Redis password
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_MODULE` - Database node package module
- `DB_EXTENSIONS` - Database extension (e.g. : uuid-ossp,other-ext,another-ext)
- `COMMAND_HANDLER` - enable/disable command handler ,default:true)
- `QUERY_HANDLER` - enable/disable query handler ,default:true)
- `COMMAND_METHOD_OVERRIDE` - default: "command.[method]"
- `QUERY_METHOD_OVERRIDE` - default: "query.[method]"

## Built With

- @nestjs/core v10.2.5
- jsonrpc 2.0
- sequelize v6.35.0
- sequelize-typescript v2.1.5

## Find Us

- [GitHub](https://github.com/yujuism/jsonrpc-dblink)

## Authors

- **yujuism** - _Initial work_ - [yujuism](https://github.com/yujuism)

See also the list of [contributors](https://github.com/yujuism/jsonrpc-dblink/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
