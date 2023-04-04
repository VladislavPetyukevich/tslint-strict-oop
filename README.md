**# tslint-strict-oop**

**## Rules**

**###** _`one-class-per-file`_
  - File must contain only one class declaration.

**###** _`only-classes-on-top`_
  - Only classes are allowed to be declared in the global scope.

**###** _`class-filename`_
  - File name must match the name of the class it contains.

**###** _`strict-unions`_
  - Explicit or implicit unions can contain only one type plus null and undefined.  
**This is not allowed:**
  ```javascript
  class Sample1 {
    someMethod() { // two types union for return type: boolean | string
      if (Math.random() > 0.5) {
        return true; // type one
      } else {
        return 'this is true'; // type two
      }
    }
  }
  ```
