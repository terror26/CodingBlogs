---
layout: blog
title: Bloom Filter : The memomory magic
date: 2024-08-07T05:11:56.773Z
category: System Design
---

### Bloom-Filters

## Today we will try to understand 
- What is Bloom filters ? 
- Problem Statement bloom filter solves
- Simple example of its working
- Bloom filter in distributed scenarios
- Distrubuted bloom filter 
- Conclusion

### What is Bloom-Filters
Let's say you want to find a particular topic or heading in a book then most simple way to find that page in book is to use its index page to identify the location of the heading and go there (preventing the full book scan). 
Another example can be lets say you want to find a particular house , then you ask guard or some person where the location of house can be then in this case the guard is your index file.

Let become more technical, Bloom filter works like a map providing minimal search time efficiancy. 
just like map , if you want to find a key it hashes the key -> k1 = h(key) then checks if k1 is present in the search space . 

Next question should be why to hash , i.e 
1. to decrease the key size we are storing to search
2. even distribution in search space
3. prevent collision 

So Bloom Filters are simply really cool maps used to find whether a key exist or not (No false negatives exist). but Kanishk is it a perfect solution no ! 
Its good solution but not perfect reason being it can have false positives i.e it might say that key exist but in reality it does why it does this we will understand more on this when we see the working example. 

### Problem Statement for Bloom Filters :
Tell me 
1. whether a person record exists in your database(distributed bloom filter based on key).
2. whether a particular key exists in your table (used in LSM during SSTable compression)

Let say we are checking the api to block a page for a particular customer based on its id. 
lets say false positive is 10% and bloom filter stays in RAM then average time for API = 

.90*(time to see if key exist in RAM) + .10*(time to find the key in DB) = .90 * 1ms + .10 * 100ms = .9 + 10 = 10.9 ms

vs when your finding all the keys in db 
100ms 

so optimization = 100/10 ~ 10 times optimization .

Now felling good right :) 



## Simple example of its working and some technical view

bloom filter uses k times hashing to hash a key and then based on the calculated hash it set the vector bit space. For eg 
create key for apples and k = 3 and vector space ,n = 5

h1(apples) = 3 % n = 3
h2(apples) = 10 % 5 = 0
h3(apples) = 11 % 5 = 1

set all the bita position formed from the hashes . 
vector but space = 
1 1 _ 1 _
0 1 2 3 4

Note space is 0 only

lets hash oranges and save 

h1(oranges) = 1
h2(oranges) = 3
h3(oranges) = 2

1 1 1 1 _
0 1 2 3 4

