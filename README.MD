# GraphQL Mesh performances example

Goal of this project is to provide an example implementation to measure GraphQL performances in 
a context where GraphQL Mesh is used as a gateway on front of REST Apis.

The sample REST APIS are:
* products
* brands
* manufacturers
* categories
* images

Each product is referencing a brand, a manufacturer, a category and a list fo images.

GraphQL Mesh is proving a graph on top os theses APIS using OpenAPI handler + a set of additional types and additional 
resolvers.

Cache transformer is configured to cache all resources except products list.
If we execute this query after a warm up call, the single outgoing HTTP call is a call to `/products`

```graphql
query products {
  getProducts {
    name
    brand {
      name
    }
    manufacturer {
      name
    }
    images {
      url
    }
    category {
      name
    }
  }
}

```

## 2021-02-04 First run

Launched on a linux laptop i7-7700HQ 32GB kernel 5.10.12 node v15.8.0.

First, we will measure performances of the `/products` backend endpoint
```
$ ab -c 1 -n 100  http://localhost:8080/products
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            8080

Document Path:          /products
Document Length:        11261 bytes

Concurrency Level:      1
Time taken for tests:   0.066 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      1147300 bytes
HTML transferred:       1126100 bytes
Requests per second:    1504.66 [#/sec] (mean)
Time per request:       0.665 [ms] (mean)
Time per request:       0.665 [ms] (mean, across all concurrent requests)
Transfer rate:          16858.41 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     0    1   0.1      1       1
Waiting:        0    0   0.1      0       1
Total:          0    1   0.1      1       1

Percentage of the requests served within a certain time (ms)
  50%      1
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%      1 (longest request)


```

Warm up GraphQL mesh cache
```
curl -s -o /dev/null -d '@query.json' -H "Content-type: application/json" http://localhost:4000/graphql
```

Measure GraphQL Mesh performance

```
$ ab -c 1 -n 100 -p query.json -T "application/json" http://localhost:4000/graphql
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            4000

Document Path:          /graphql
Document Length:        56586 bytes

Concurrency Level:      1
Time taken for tests:   30.738 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      5679800 bytes
Total body sent:        29300
HTML transferred:       5658600 bytes
Requests per second:    3.25 [#/sec] (mean)
Time per request:       307.379 [ms] (mean)
Time per request:       307.379 [ms] (mean, across all concurrent requests)
Transfer rate:          180.45 [Kbytes/sec] received
                        0.93 kb/s sent
                        181.38 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:   294  307  16.5    301     372
Waiting:      293  307  16.6    301     372
Total:        294  307  16.5    301     372

Percentage of the requests served within a certain time (ms)
  50%    301
  66%    304
  75%    308
  80%    310
  90%    338
  95%    345
  98%    368
  99%    372
 100%    372 (longest request)
```

For this run, based on 75% percentile GraphQL Mesh adds 300ms latency to backend REST API latency adding 1300
fields to the original REST response.  