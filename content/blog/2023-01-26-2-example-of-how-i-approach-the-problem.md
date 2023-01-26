---
layout: blog
title: "#2 Example of how i approach the problem"
date: 2023-01-26T09:43:13.334Z
category: ALOGRITHM
---
N﻿ote This is the kadane algorithm: So a great another blog for it is . https://www.interviewbit.com/blog/maximum-subarray-sum/ 

L﻿argest Continous Sum : 

```
Array: [1, 2, 3, 4, 5]
Subarrays:
[1]
[2]
[3]
[4]
[5]
[1, 2]
[2, 3]
[3, 4]
[4, 5]
[1, 2, 3]
[2, 3, 4]
[3, 4, 5]
[1, 2, 3, 4]
[2, 3, 4, 5]
[1, 2, 3, 4, 5]

[1] => 1
[2] => 2
[3] => 3
[4] => 4
[5] => 5
[1, 2] => 3
[2, 3] => 5
[3, 4] => 7
[4, 5] => 9
[1, 2, 3] => 6
[2, 3, 4] => 9
[3, 4, 5] => 12
[1, 2, 3, 4] => 10
[2, 3, 4, 5] => 14
[1, 2, 3, 4, 5] => 15

Therefore the solution should be 15


Array: [4 -6 2 5]
Answer: 7
[4] => 4
[-6] => -6
[2] => 2
[5] => 5
[4, -6] => -2
[-6, 2] => 4
[2,5] => 5
[2, 5] => 7
[4, -6, 2] => 0
[-6, 2, 5] => 0
[4, -6, 2, 5] => 4

Therefore the solution is 7
```



S﻿o after understanding the problem and working out an example, I know that -ve sign does have some significance to look into. So subset with -ve numbers can be ignored. 



O﻿ne solution can now be all continious subset generation, but its O(2^n). 

N﻿ext since -ve number one can be ignored and i.e we keep of reseting the sum after encountering the -ve this might work. But lets take one example and check this works 

```


Array: [4 -1 2 5]
Answer: 7
[4] => 4
[-1] => -1
[2] => 2
[5] => 5
[4, -1] => 3
[-1, 2] => 1
[2,5] => 7
[4, -1, 2] => 5
[-1, 2, 5] => 6
[4, -1, 2, 5] => 10

Therefore the solution is 7
```



T﻿his case proves that with each -ve dont reset the sum but only when sumTillNow > 0 . 

S﻿o continous sum (0,n) we know , this just involves reset the sum and then starting from i+1,n

w﻿ith this ,we can write the psuedo code something like this. 



```
initialise maxSum := 0
loop i (0 to n)
  tmpSum := currEle
  if tmpSum goes zero
    reset tmpSum:= 0
  else 
    update maxSum := Maximum(tmpSum, maxSum);
return maxSum;
```





N﻿ow java code can be 

```

class KadaneAlgo {
  public getMaxContiniousSum(int[] arr,int n) {
    long maxSum = 0 , tmpSum = 0;
    for(int i = 0;i<n;i++) {
      tmpSum += arr[i];
      if(tmpSum < 0) {
        tmpSum =0;
      } else {
        maxSum = Math.max(tmpSum, maxSum);
      }
    }
    return maxSum;
  }
  
}
```