<h1 align="center" style="font-size: 2.7rem;">Atelier Products Micro-Service</h1>

<h2 align="center" style="font-size: 1.5rem;">Utilizing modern technologies and advanced database optimization techniques to implement a backend solution with RESTful API.</h2>

![readme dependency logos](assets/readme-logos.png 'readme dependency logos')

## Overview

- Perform an extract, transform, and load (ETL) process for 30+ million records
- Design RESTful API server to handle front end application requests
- Simplify web scaling through Docker containers
- Implement server side caching with Redis to improve latency, and throughput
- Performance testing and fine tuning throughout the development process

## Table of Contents

- [Installation](#Installation)
- [Technologies Used](#Technologies-Used)
- [Requirements](#Requirements)
- [ETL](#ETL)
- [Routes](#Routes)
- [Load Testing](#Load-Testing)
- [Contributors](#Contributors)

## Installation

```
npm install

npm start
```

## Technologies Used

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Docker](https://www.docker.com/)
- [AWS EC2](https://aws.amazon.com/ec2/getting-started/)
- [Loader.IO](https://loader.io/)

## Requirements

Ensure that the following modules are installed before running `npm install`

- Node v10.13.10 or higher

## ETL

The ETL process was done programmatically, utilizing Node.js file system module and csv-parser module. 6 CSV files containing over 30 million rows of data was buffered, streamed, and transformed in this format.

## Routes

| Request Type | Endpoint                      | Returns                                                                                                                                                      | Status |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| GET          | /products                     | An array containing all products by id in ascending order. Number of products returned defaults to 5 or can be modified using the count and page parameters. | 200    |
| GET          | /products/:product_id         | An object containing full product details of specific product.                                                                                               | 200    |
| GET          | /products/:product_id/related | An array of product ids for all related products for a particular product.                                                                                   | 200    |
| GET          | /products/:product_id/styles  | An object containing the product id and a results property containing all of the styles data for that product.                                               | 200    |

## Load Testing

Load testing was conducted with Artillery.io in local development and then Loader.io in the 2nd phase in deployment on AWS EC2 (t2.micro) instances.

The minimum requirements were as follows:

|                          | Stress Load | Latency  | Error Rate |
| ------------------------ | ----------- | -------- | ---------- |
| **Minimum Requirements** | 100 RPS     | < 2000ms | < 1%       |

Initial testing for all endpoints passed these requirements with the latency measuring between 2-3ms. Latency and throughout remained under 50ms until around 600 requests per second.

## Results After Redis Caching

After Redis Caching was implemented, server performance increased significantly for all endpoints as shown in the examples below:

### /products/:product_id `Initial` Results

---

| Route                     | Stress Load | Latency    | Error Rate | Success Rate |
| ------------------------- | ----------- | ---------- | ---------- | ------------ |
| **/products/:product_id** | 1000 RPS    | **1935ms** | 0%         | 73%          |

![Initial product id loader test](assets/product-id-initial.png '/products/:product_id Initial Loader Results')

### /products/:product_id `Post` Redis Caching Results

---

| Route                     | Stress Load | Latency  | Error Rate | Success Rate |
| ------------------------- | ----------- | -------- | ---------- | ------------ |
| **/products/:product_id** | 1000 RPS    | **12ms** | 0%         | 100%         |

![Post Redis product id loader test](assets/product-id-post-redis.png '/products/:product_id Post Redis Loader Results')

#### `Final Results` - A Redis cache decreased the latency from 1935ms to 13ms, a 99.4% decrease, with no errors. The Redis cache is a great solution that provides efficient server side optimization through an optimized database caching system optimized for speed.

---

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/WarrenWongCodes"><img src="https://avatars.githubusercontent.com/u/8570718?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Warren Wong</b></sub></a><br /></td>
  </tr>
</table>
