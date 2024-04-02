---
layout: blog
title: Eureka Service Discovery Theory & Implementation

date: 2024-04-02T18:11:56.773Z
category: System Design
---
## H﻿ello folks ,

## Eureka Service Discovery

### Introduction
Service discovery is crucial for microservices architectures. Let's discuss why it's needed.

Consider a scenario where Service A needs to make an API request to Service B. One way to do this is by hardcoding the URL (`restTemplate.exchange("url_service_b")`). However, if Service B goes down, the call from A to B will fail. Even if you spin up another instance of Service B at a new URL (`url_service_b_new`), Service A won't know about it unless you restart A with the correct configurations or even worse, code changes.

Now, let's solve this problem with a black box:

```
A -> BlackBox -> B
```

This black box represents service discovery and obtaining the correct URL to call Service B.

### Technical Overview
There are two types of service discovery available:
1. Client-side service registry (Client does most heavy lifting).
2. Server-side service registry (Client asks registry to do most heavy lifting).

For a detailed technical explanation, refer to [this post](https://www.linkedin.com/pulse/service-dicovery-vivek-bansal-mrr3c/).

### Example Project
#### Eureka Server

1. Add the dependencies:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

2. Add the properties in `application.properties`:
```properties
spring.application.name=eurekaServer
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
logging.level.com.netflix.eureka=OFF
logging.level.com.netflix.discovery=OFF
```

3. Add `@EnableEurekaServer` to the top of your main class.

#### Eureka Client

1. Add the dependency in your `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

2. Add `@EnableDiscoveryClient` to the top of your main class.

Now, when you run your client on port 8080, `localhost:8761` should show the instance in the list.

Now for the persistent ones on making this far 
### Bonus: Making an API Call
Add the following `RestController` code to your Spring client project:

```java
@RestController
public class ServiceInstanceRestController {

    private final LoadBalancerClient loadBalancer;
    private final RestTemplate restTemplate;

    @Autowired
    public ServiceInstanceRestController(LoadBalancerClient loadBalancer, RestTemplate restTemplate) {
        this.loadBalancer = loadBalancer;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/balance")
    public String sendRequestToService() {
        // Load balance the service instances using Eureka
        ServiceInstance serviceInstance = loadBalancer.choose("EUREKA-CLIENT"); // TODO : replace this with the registered service name you want to call.

        // Build URL using the service instance
        String url = serviceInstance.getUri().toString() + "/ping";

        // Send a request to the chosen service instance
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Return response body
        return response.getBody();
    }

    @GetMapping("/ping")
    public String getPing() {
        return "pong";
    }

}
```

Now, you can see that to make call between two service it asks the load balancer which further asks the registry about the up services and gets the URL for that and then makes the URL call. 

These extensible coding style make clean code , and clean code is signature of a great programmer and now you're one step closer. :P
