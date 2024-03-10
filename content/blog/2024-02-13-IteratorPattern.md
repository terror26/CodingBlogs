---
layout: blog
title: "Java Iterator Pattern"
date: 2024-02-13T09:31:35.946Z
category: System Design
---

***Java Iterator Pattern***

**Usage**: 
Its one of the most common pattern and its implementation is none other than the collections in java. Lets understand it easily.
So main component of this pattern is your concreateAggregators (Which holds the actual data) i.e ArrayList, HashSet , TreeSet , etc .

So 
```java
  List<Integer> data = new ArrayList<>();
  data.add(1);
  data.add(2);
  data.add(3); // all this is stored in ArrayList under     "transient Object[] elementData; " 
```

Now, next is to get the iterator for this. 
you call the method 

```java
  java.util.Iterator<Integer> itr = data.iterator();
```

this will return iterator which is interface and its correct implementation class will be invoked. For eg: 

```java
  // in case of ArrayList , this is called with its private class Itr implementing the further functionality
  public Iterator<E> iterator() {
        return new Itr(); // Itr is private class with its specific ArrayList implementation
    }
```


in the case of HasSet, different private class concrete implementations will be used.

Now. what's this Iterator interface? 
it looks like this

```java

    //Returns {@code true} if the iteration has more elements.
    boolean hasNext();

    // Returns the next element in the iteration.
    E next();
```

, Now let's see a complete custom example (I have used generic dataType but you can remove this if you find this confusing). 

```java

// Note creating in single file so that no tab switching is required

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
        new Main().testBooksCollection();
    }

    // to test the collection Class
    public void testBooksCollection() {
        List<Integer> arr = new ArrayList<>();
        java.util.Iterator<Integer> itr = arr.iterator();
        Book<String> book1 = new Book<>("Alice in wonderland");
        Book<String> book2 = new Book<>("Game Of Throne");
        Book<String> book3 = new Book<>("Kite Runner");
        Lib<String> lib = new Lib<>(Arrays.asList(book1,book2,book3));
        Iterator<String> iterator = lib.createIterator();
        while(iterator.hasNext()) {
            Book<String> v = iterator.next();
            System.out.println(v.toString());
        }
    }

    public class Book<T> {
        T bookVal;

        public Book(T bookVal) {
            this.bookVal = bookVal;
        }

        @Override
        public String toString() {
            return "Book{" +
                    "bookVal=" + bookVal +
                    '}';
        }
    }

    // collection object also called aggreagtor, in java these are ArrayList, HashSet, TreeSet , etc
    public class Lib<T> { 
        List<Book<T>> data;

        public Lib(List<Book<T>> data) {
            this.data = data;
        }


        Iterator<T> createIterator() {
            return new SimpleBookIterator<T>(data);
        }
    }

    // Iterator interface which IteratorConcreate class will implement
    public interface Iterator<T> {
        Book<T> next();
        boolean hasNext();
    }

    public class SimpleBookIterator<T> implements Iterator {
        // collection to iterate on
        List<Book<T>> data;
        int curr = 0;

        public SimpleBookIterator(List<Book<T>> data) {
            this.data = data;
            curr = 0;
        }

        @Override
        public Book<T> next() {
            return data.get(curr++);
        }

        @Override
        public boolean hasNext() {
            return curr < data.size();
        }
    }
}
```

OUTPUT: 

```java
  Hello world!
  Book{bookVal=Alice in wonderland}
  Book{bookVal=Game Of Throne}
  Book{bookVal=Kite Runner}
```

Hope this helps :).








