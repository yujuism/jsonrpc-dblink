# jsonrpc-dblink

An optimized Docker container designed for seamless execution of Sequelize, enabling swift and efficient database operations within Node.js environments.

## Getting Started

### Prerequisities

In order to run this container you'll need docker installed.

- [Windows](https://docs.docker.com/windows/started)
- [OS X](https://docs.docker.com/mac/started/)
- [Linux](https://docs.docker.com/linux/started/)

To run this container, you need to supply your own Node.js package model using Sequelize and specify your package name within the environment variable `DB_MODULE`.

Here is an example of the model usage with Sequelize and TypeScript:

- **Example Repository:** [Model Example with Sequelize and TypeScript](https://github.com/yujuism/model-example-dblink)
- **NPM Package:** [model-example-dblink](https://www.npmjs.com/package/model-example-dblink)

### Installation

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
- nestjs-json-rpc v4.4.0
- sequelize v6.35.0
- sequelize-typescript v2.1.5

## Usage

### Methods

Below is the list of methods that can be utilized. For further details on how to use these queries, please refer to the [Sequelize documentation](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/) page.

#### Conversions

- Initial `model` will be expressed by field `id`
- `model` will be expressed by string instead of object

```javascript
{
  model: MyModel;
}
```

```json
{
  "model": "MyModel"
}
```

- `Op` will be expressed by string instead of object

```javascript
{
  [Op.in]: [1,2,3,4]
}
```

```json
{
  "Op.in": [1, 2, 3, 4]
}
```

#### Commands

- `command.sync`

```json
{
  "jsonrpc": "2.0",
  "method": "command.sync",
  "id": "All",
  "params": {
    "alter": true
  }
}
```

- `command.create`

```json
{
  "jsonrpc": "2.0",
  "method": "command.bulkCreate",
  "id": "Employee",
  "params": {
    "data": {
      "name": "Alice",
      "email": "alice@example.com",
      "department_id": "687d4262-cccf-4d7d-a06d-31034777fa03",
      "code": "EMP001"
    }
  }
}
```

- `command.createBulk`

```json
{
  "jsonrpc": "2.0",
  "method": "command.bulkCreate",
  "id": "Employee",
  "params": {
    "data": [
      {
        "name": "Alice",
        "email": "alice@example.com",
        "department_id": "687d4262-cccf-4d7d-a06d-31034777fa03",
        "code": "EMP001"
      },
      {
        "name": "Bob",
        "email": "bob@example.com",
        "department_id": "cf17582b-9d0c-48df-ad3b-d22ee1bd0c5d",
        "code": "EMP002"
      },
      {
        "name": "Charlie",
        "email": "charlie@example.com",
        "department_id": "687d4262-cccf-4d7d-a06d-31034777fa03",
        "code": "EMP003"
      }
    ]
  }
}
```

- `command.update`

```json
{
  "jsonrpc": "2.0",
  "method": "command.update",
  "id": "Employee",
  "params": {
    "data": {
      "name": "Alice Lastname",
      "email": "new_email@example.com"
    },
    "where": {
      "id:": "8d1803d9-23cb-4673-bd24-bcd8d02c147b"
    }
  }
}
```

- `command.destroy`

```json
{
  "jsonrpc": "2.0",
  "method": "command.destroy",
  "id": "Employee",
  "params": {
    "where": {
      "id:": "8d1803d9-23cb-4673-bd24-bcd8d02c147b"
    }
  }
}
```

- `command.removeCache`

```json
{
  "jsonrpc": "2.0",
  "method": "command.destroy",
  "id": "Employee"
}
```

- `command.restore`

```json
{
  "jsonrpc": "2.0",
  "method": "command.restore",
  "id": "Employee",
  "params": {
    "where": {
      "id:": "8d1803d9-23cb-4673-bd24-bcd8d02c147b"
    }
  }
}
```

#### Queries

- `query.findOne`
- `query.findAll`
- `query.findAndCountAll`

#### `Request`

```json
{
  "jsonrpc": "2.0",
  "method": "query.findAll",
  "id": "Employee",
  "params": {
    "attributes": ["code", "name", "email"],
    "include": [
      {
        "model": "Task",
        "attributes": ["name"],
        "include": [
          {
            "model": "Project",
            "attributes": ["name"]
          }
        ]
      },
      {
        "model": "Department",
        "attributes": ["name"]
      }
    ]
  }
}
```

#### `Response`

```json
{
  "jsonrpc": "2.0",
  "method": "query.findAll",
  "id": "Employee",
  "result": {
    "success": true,
    "data": [
      {
        "code": "EMP001",
        "name": "Alice",
        "email": "alice@example.com",
        "Task": [
          {
            "name": "Campaign Strategy",
            "Project": {
              "name": "Ad Campaign"
            }
          }
        ],
        "Department": {
          "name": "Sales"
        }
      },
      {
        "code": "EMP002",
        "name": "Bob",
        "email": "bob@example.com",
        "Task": [
          {
            "name": "Design Prototypes",
            "Project": {
              "name": "Product Launch"
            }
          }
        ],
        "Department": {
          "name": "Marketing"
        }
      },
      {
        "code": "EMP003",
        "name": "Charlie",
        "email": "charlie@example.com",
        "Task": [
          {
            "name": "Market Research",
            "Project": {
              "name": "Ad Campaign"
            }
          }
        ],
        "Department": {
          "name": "Sales"
        }
      }
    ],
    "code": 200
  }
}
```

## Find Us

- [GitHub](https://github.com/yujuism/jsonrpc-dblink)

## Authors

- **yujuism** - _Initial work_ - [yujuism](https://github.com/yujuism)

See also the list of [contributors](https://github.com/yujuism/jsonrpc-dblink/contributors) who
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
