**SOLID PATTERN**
1. **Single Responsibility Principle (SRP)**:

   ```java
    public class Waiter() {
       public void serve() {
         // 1. bringGrocery
         // 2. cook
         // 3. server food
       }
       private void cook() {
        // serve food logic
      }
      private void bringGrocery() {
         // bring grocery logic
      }
    }

Explanation:
The initial code had the Waiter class handling multiple responsibilities like bringing groceries, cooking, and serving food. 
However, the fix suggests splitting these responsibilities and having a class focused solely on serving food. This adheres to the Single Responsibility Principle by ensuring that each class has only one reason to change, leading to better code clarity, maintainability, and improved unit testing coverage.


   ```java
    public class Waiter {
      public void serve(Food food) {
      // serve food only
      }
    }
   ```

2.**Open/Closed Principle (OCP):***

```java
  public class Waiter() {
    public void serve(Food food) {
      // if loyalCustomer -> then serve something extra
      // serve food
    }
  }
```

Now lets say a priority/loyal customer came. Waiters have a priority to serve those customers differently as customer changes then serve logic always changes and thus introduces the unknown error Better Code would be 

  ```java
    public class Customer {
      Waiter waiter;
      waiter.serve();
      }

    interface Waiter waiter {
      public void serve();
      }

    public class LoyalWaiterImpl implements Waiter {
      serve() {
        // loyal customer server logic
      }
  }

    public class NormalWaiterImpl implements Waiter {
      serve() {
          // normal customer server logic
      }
    }

```
Explanation:
The initial code had the Waiter class directly checking if the customer is a loyal customer and serving extra. However, the fix suggests using interfaces and implementing separate classes for different types of customers. This adheres to the Open/Closed Principle by allowing the system to be easily extended without modifying existing code, thus improving maintainability and scalability.


  3. **Liskov Substitution Principle (LSP)**: - (class A <- class B ), then class A object should be replaceble for class B.
   for this, i would refer to this link: https://tusharghosh09006.medium.com/liskov-substitution-principle-lsp-744eceb29e8

   
  4. **Interface Segregation**: Its quite simple. don't make bulky interfaces so that classes are not forced to implement those methods


```java
  public interface Vehicle {
    public void turboBoost(); // extra not required func
    public void tyre();
    public void changeEngine();
  }

  public HondaOldCar implements Vehicle {
    @Override
    public void turboBoost() {
      // return as its not applicable for this
    }
  }
```

Update of the above code: 

```java
public interface Vehicle {
    public void tyre();
    public void changeEngine();
}

public interface TurboVehicle {
    public void turboBoost();
}

public class HondaOldCar implements Vehicle {
    // Implement tyre() and changeEngine()
}

public class ExclusiveTurboVehicle implements Vehicle, TurboVehicle {
    // Implement tyre(), changeEngine(), and turboBoost()
}
```

Explanation:
The initial Vehicle interface contained methods for turbo boosting, which is not applicable to all vehicles. However, the fix suggests splitting the interface into smaller, more focused interfaces, allowing classes to implement only what they need. This adheres to the Interface Segregation Principle by preventing clients from depending on methods they do not use, thus improving code maintainability and reducing coupling.

  5. **Dependency Inversion Principle (DIP)**:

In simple terms: If I own a laptop then it doesn't mean if I want to type i have to use its buterfly keyboard. i can use my great mechanical keyboard or some better external keyboard.

Eg: 
```java
  public class Laptop {
    Keyboard keyboard = new MacKeyBoard(); // It make it hard bound to use only MacKeyBoard
    public void type() {
      keyboard.pressKeys();
    }
  }
```

Better code is 

```java
public class Laptop {
    Keyboard keyboard; // Let it be instantiable

    public Laptop(Keyboard keyboard) { // 
        this.keyboard = keyboard
    }
    
    public void type() {
        keyboard.pressKeys();
    }
}

public class UserTyping {
    Keyboard keyboard;
    
    public void init() {
        keyboardToUse = new MacKeyboard or new MechanicalKeyboard();
        Laptop laptop = new Laptop(keyboardToUse);
    }
    
    public void startTyping {
        laptop.type();
    }
}

```
Explanation:
The initial Laptop class tightly coupled with a specific type of keyboard, making it hard to change. However, the fix suggests using dependency injection to pass the keyboard object during initialization, enabling easier swapping of keyboards without modifying the Laptop class. This adheres to the Dependency Inversion Principle by decoupling high-level modules from low-level modules, promoting code reusability, flexibility, and testability.

















   
