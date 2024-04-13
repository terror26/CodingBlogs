---
layout: blog
title: "SQL Index Guide 101"
date: 2024-04-13T01:31:35.946Z
category: System Design
---

## SQL Index Guide 101

Understanding optimization is crucial for developers, even when it comes to databases. Some might argue that backend developers don't need to know DBA things, but that's a misconception.

Today, let's delve into the basics and cover important topics such as:

1. Clustered Index
2. Unclustered Index
3. Covering Index
4. Composite Index
5. Page Seek vs Page Scan
6. B-Tree

### Basics:

DBMS (Database Management System) acts as a wrapper on top of the storage engine (e.g., InnoDB for MySQL). It provides a library for writing efficient queries.

### Example:

Consider the following table:

``` SQL
| EmpId(PK) | EmpName | LastSalaryUpdated |
|-----------|---------|-------------------|
| 1         | Kanishk | 1998              |
| 2         | Manoj   | 2024              |
| ...       | ...     | ...               |

```
### Storage:

Physically, the table is broken into chunks fitting into page size. For instance, if a row takes approximately 363 bytes and a page is 4KB, it would require around 88624 pages to store a million entries, with 12 rows per page.

``` SQL
+---------------------+
|        Page 1       |
+---------------------+
| EmpId | EmpName | LastSalaryUpdated |
+-------+---------+-------------------+
|   1   | Kanishk |        1998       |
|   2   | Manoj   |        2024       |
|  ...  |   ...   |        ...        |
|  12  |   Piyush |        2022       |
+-------+---------+-------------------+

```

Now just to understand it, to access a record, let's say empId 1 you need to bring the whole page 1 from disk to main memory, it cant be like just accessing the first value.  and lets say it takes 1 sec to access a page from disk to main memory. 

So to select the millionth record total page-seek required will be 88624 pages i.e. 88624 seconds. Too much time right :P 

What if it could have been better faster . answere is there is a solution and solution is INDEXES. 
Note: B-Tree im referring to here is B+ Tree only. The difference between them is from an optimization standpoint and I'll link on good article to follow here.  

![Clustered Index]([example.png](https://github.com/terror26/images/blob/main/Clustered%20index.png))

Lets say these page access could be reduced then the query will run much faster as bottle-neck is not cpu but I/O accesses.

Now Index is something very similar to your catalog. 


``` SQL
Index on EmpId:
+--------+---------+
| EmpId  | Pointer |
+--------+---------+
|   1    |   PTR1  |
|   2    |   PTR2  |
|   3    |   PTR3  |
|   4    |   PTR4  |
|  ...   |   ...   |
+--------+---------+

```

PTR1 can be understood as the page on which the topic is explained or the page where the row values are stored.

### Indexes:

Indexes can significantly optimize queries. Let's understand them:

Now size of row in this index table is EmpId(4Byte) + Pointer(4B) -> 8B
Total rows in each page -> 4KB/ 8B = 512 , 

Total pages to find an EMPId = (1 million/512) = 1954 pages.

and then +1 page to access that page which holds the data.

So total time  = 1955sec , Optimization = 88624 / 1955 ~ 46x . Nice..

So the index created above is on the primary Key and is also called the clustered Index. 
What exactly is a clustered index? 

**Clustered Index:**

Technically: A clustered index is an index in a database management system (DBMS) where the rows of a table are stored in the same order as the index key. This means that the data in the table is physically sorted on disk based on the values of the indexed column(s). In other words, the index defines the physical order of the rows in the table. Lets understand this by diagram

![Clustered Index Diagram](https://i.imgur.com/QCf2Gz3.png)

As you can see the blue Block i.e. index values are sorted and so the pointer to the disk block is also sorted i.e if field 1 ptr location is 42nd position so next value pointer will be greater than 42nd position itself.



**Uncluster

In short: Disk block order are not sorted.

Digging Deeper for both : 
B-tree for Clustered Index() on EmpId:
``` SQL

                                  [500,000] -> root 
                                /            \
                         [250,000]           [750,000]
                        /        \          /         \
                [125,000]     [375,000]  [625,000]   [875,000]
               /    |     \   /    |    \  /    |    \  /     \
        [62,500] [187,500] ...    ...   ...    ...   ...     ...
        /   |   \    /  |  \
   [31,250] ...
   /    |    \
  ...

```
Here's a step-by-step breakdown of the search process:
> How it search for key 500888 in the above B tree


Start at the Root: We start at the root node, which contains the range [500,000].

    Compare with Root Keys: We compare the key 500,888 with the keys in the root node. Since 500,888 falls within the range [500,000], we move to the left child node.

    Move to the Left Child Node: We move to the left child node, which contains the range [250,000].

    Compare with Left Child Keys: We compare the key 500,888 with the keys in the left child node. Since 500,888 falls within the range [500,000], we move to the left child node again.

    Move to the Left Child Node (Leaf Node): We continue moving down the tree, navigating through the left child nodes until we reach a leaf node.

    Search in Leaf Node: In the leaf node, we search for the key 500,888 among the keys stored in the node.


In the above what a leaf Node stores : 
It stores the actual key values and the PTR to the location of the row Value. similar to the index we saw earlier.

Leaf Nodes:
Leaf Node 1: [500,001 - 550,000]
Leaf Node 2: [550,001 - 600,000]
Leaf Node 3: [600,001 - 650,000]
... and so on.

Entries in Leaf nodes as per above calculation: 512 entries

Intermediate Rows helped us to reach Leaf Nodes. 
Total levels : 
    Now, let's find out the total number of levels in the B-tree for a million EmpId values:

    Assuming each level is completely filled, with the root level containing 1 entry, the second level containing 512 entries, the third level containing (512 * 512) entries, and so on, until the leaf level.

    The total number of levels can be calculated using logarithmic base 512, because each level has 512 times more entries than the level above it:
    Total levels = log base 512 (Number of index entries)
             ≈ log base 512 (1,000,000 / 512)
             ≈ log base 512 (1,953.125)
             ≈ 2.88

Talking about optimization : Page access  = 3 Page to find pointer to row Value + 1 ~ 4 Page access = 4sec 
Total optimization = 88624/4 = 22,156x performance boost.

With this optimization, you're the next CTO of your company. Jokes apart let's dig further. 

Now you have the motivation to use the B Tree

The index on Primary Key is cute but that's not how the real world works. 

Let's say you want to find EmpName which is not the primary Key. What to do then? 

Unclustered Index on EmpName: 

``` SQL
+---------+---------+
| EmpName | Pointer |
+---------+---------+
|  Alice  |   PTR1  |
|   Bob   |   PTR2  |
|  John   |   PTR3  |
|  Sarah  |   PTR4  |
|  ...    |   ...   |
+---------+---------+
```
The pointers (PTR1, PTR2, etc.) are internal references used by the database engine to locate the actual rows in the table.
``` SQL

               +----------------------------------------+
                                        |                   [Root]               |
                                        +----------------------------------------+
                                       /                  |                  \
           +-------------+---------------+     +---------------+     +---------------+
           |   [Alice]   |   [Bob]       |     |   [Charlie]   |     |   [David]     |
           +-------------+---------------+     +---------------+     +---------------+
             /  |   \       /   |   \         /   |   \         /   |   \         /   \
   +-------+-+  ...  ...  ...  ...  ...    ...  ...  ...    ...  ...  ...    ...  ...
   |Leaf1  | |       |       |       |          |       |          |       |
   +-------+---------+-------+-------+----------+-------+----------+-------+
   |EmpName, PTR1      EmpName, PTR2        EmpName, PTR3        EmpName, PTR4
   +--------------------------------------------------------------------------+
   |EmpName, PTR5      EmpName, PTR6        EmpName, PTR7        EmpName, PTR8
   +--------------------------------------------------------------------------+


```
   The root node contains pointers to child nodes (internal nodes).
Internal nodes contain key values and pointers to child nodes (either internal nodes or leaf nodes).
Leaf nodes contain key values and pointers to the actual data records (or data pages).
Each leaf node contains EmpName values and their corresponding pointers.
The leaf nodes may be linked together to support efficient range queries.



Covering Index : 
Let's suppose life is great but now you come across this query : 
select lastUpdatedSalary from EMPTAble where EMPName > 'ALICE' and EMPName <'Zack'

so this range query is a blunder with an unclustered index why : 

say leaf nodes are like this

``` SQL
Leaf Node 1:
+-------------------------------------------+
| EMPName               | Pointer           |
+-------------------------------------------+
| Alex                  | PTR1  ->   PAGE1  |
| Amanda                | PTR2 ->   PAGE4   |
| Bob                   | PTR3 ->   PAGE2   |
| ...                   | ...               |
+-------------------------------------------+

Leaf Node 2:
+-------------------------------------------+
| EMPName               | Pointer           |
+-------------------------------------------+
| Charlie               | PTR4    ->  PAGE9  |
| David                 | PTR5    ->  PAGE1  |
| Emma                  | PTR6     -> PAGE2  |
| ...                   | ...               |
+-------------------------------------------+
```
so random IO in case of unclustered index range query can be huge. 

100 Records might lead to 100 different page access alltogether
what if after getting to leaf node you got the value required.

``` SQL
Leaf Node 1:
+-------------------------------------------+
| EMPName               | Pointer | lastUpdatedSalary  |
+-------------------------------------------+
| Alice                 | PTR1    | 2030   |
| Amanda                | PTR2    | 2029   |
| Bob                   | PTR3    | 2021   |
| ...                   | ...     | ...    |
+-------------------------------------------+

Leaf Node 2:
+-------------------------------------------+
| EMPName               | Pointer | lastUpdatedSalary  |
+-------------------------------------------+
| Charlie               | PTR4    | 2024    |
| David                 | PTR5    | 2025    |
| Emma                  | PTR6    | 2026    |
| Kanishk               | PTR6    | 2026    |
| ...                   | ...     | ...     |
+-------------------------------------------+


```
Now getting to the leaf doesn't require you to go further. Voila query optimization done and dusted. 

Another use case is the Composite Index : 
In this case not just the leaf node has an extra field but the root and intermediate nodes also contain the field

In basic term: Sorted first by EmpName then by lastUpdatedSalary. Cons the depth might increase as lesser rows can be stored.



Now I know I have kept composite and covering index short but I recommend going through this Amazing video I found on YouTube. 

Credits: the images are from those videos only. 
https://www.youtube.com/watch?v=-Z0ktdahjwo&list=PLC4UZxBVGKtdKBV0C9oD9UEDUeRoX-IfK&index=5
https://www.youtube.com/watch?v=1h2jSzMPd20&list=PLC4UZxBVGKtdKBV0C9oD9UEDUeRoX-IfK&index=6

Happy Coding. :)

















