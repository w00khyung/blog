---
sidebar_position: 1
---

# 1장. 리액트 개발을 위해 꼭 알아야 할 자바스크립트

# 1.1 자바스크립트의 동등 비교

### 1.1.1. 자바스크립트의 데이터 타입

**원시 타입(primitive type)**

- null과 undefined
  - undefined는 ‘선언됐지만 할당되지 않은 값’이고, null은 ‘명시적으로 비어 있음을 나타내는 값’으로 사용하는 것이 일반적이다.
- Boolean
  - 참(true)과 거짓(false)만을 가질 수 있는 데이터 타입이다.
  - boolean 형의 값 외에도 조건문에서 true와 false처럼 취급되는 truthy, falsy 값이 존재한다.
    | 값              | 타입           | 설명                                                              |
    | --------------- | -------------- | ----------------------------------------------------------------- |
    | false           | Boolean        | false는 대표적인 falsy한 값이다.                                  |
    | 0, -0, 0n, 0x0n | Number, BigInt | 0은 부호나 소수점 유무에 상관없이 falsy한 값이다.                 |
    | NaN             | Number         | Number가 아니라는 것을 뜻하는 NaN(Not a Number)는 falsy한 값이다. |
    | null            | null           | null은 falsy한 값이다.                                            |
    | undefined       | undefined      | undefined는 falsy한 값이다.                                       |
- Number
  - 정수와 실수를 구분해 저장하는 다른 언어와 다르게, 자바스크립트는 모든 숫자를 하나의 타입에 저장했었다.
  - ECMAScript 표준에 따르면 -(2^53-1)과 2^53-1 사이의 값을 저장할 수 있다. 이후에 bigint가 등장하기 전까지는 이 범위 외의 값들을 다루기가 어려웠다.
  ```jsx
  const a = 1;

  const maxInteger = Math.pow(2, 53);
  maxInteger - 1 === Number.MAX_SAFE_INTEGET; // true

  const minInteger = -(Math.pow(2, 53) - 1);
  minInteger - 1 === Number.MAX_SAFE_INTEGET; // true
  ```
- BigInt
  - number가 다룰 수 있는 숫자 크기의 제한을 극복하기 위해 ES2020에 새로 나왔다.
  ```jsx
  // 기존 number의 한계
  900719925470992 === 9007199254740993; // 마지막 숫자는 다른데 true가 나온다. 이는 더 이상 다룰 수 없는 크기이기 때문이다.

  const maxInteger = Number.MAX_SAFE_INTEGER;
  console.log(maxInteger + 5 === maxInteger + 6); // true???

  const binInt1 = 900719925470995n; // 끝에 n을 붙이거나
  const bigInt2 = BigInt(900719925470995); // BigInt 함수를 사용하면 된다.
  ```
- String
  - 텍스트 타입의 데이터를 저장하기 위해 사용된다.
  - 백틱을 사용해서 표현한 문자열은 템플릿 리터럴(template literal)이라고 한다.
    ```jsx
    const longText = `
    안녕하세요.
    `;
    ```
  - 자바스크립트 문자열의 특징 중 하나는 문자열이 원시 타입이며 변경 불가능하다는 것이다.
    ```jsx
    const foo = 'bar';

    console.log(foo[0]); // 'b'

    // 앞 글자를 다른 글자로 변경해 보았다.
    foo[0] = 'a';

    // 이는 반영되지 않는다.
    console.log(foo); // bar
    ```
- Symbol
  - Symbol은 ES6에서 추가된 타입으로, 중복되지 않는 어떠한 고유한 값을 나타내기 위해 만들어졌다.
  - 심벌을 생성하려면 반드시 `Symbol()` 을 사용해야만 한다.
  ```jsx
  // Symbol 함수에 같은 인수를 넘겨주더라도 이는 동일한 값으로 인정되지 않는다.
  // 심벌 함수 내부에 넘겨주는 값은 Symbol 생성에 영향을 미치지 않는다 (Symbol.for 제외).
  const key = Symbol('key');
  const key2 = Symbol('key');

  key === key2; // false

  // 동일한 값을 사용하기 위해서는 Symbol.for를 활용한다.
  Symbol.for('hello') === Symbol.for('hello'); // true
  ```

**객체 타입(object/reference type)**

- 객체 타입은 원시 타입 이외의 모든 것, 즉 자바스크립트를 이루고 있는 대부분의 타입이 바로 객체 타입이다.
- 여기에는 배열, 함수, 정규식, 클래스 등이 포함된다.
- 객체 타입은 참조를 전달한다고 해서 참조 타입으로도 불린다.

```jsx
typeof [] === 'object' // true
typeof {} === 'object' // true

function hello() {}
typeof hello === 'function' // true

const hello1 === function () {
}

const hello2 === function () {
}

// 객체인 함수의 내용이 육안으로는 같아 보여도 참조가 다르기 때문에 false가 반환된다.
hello1 === hello2 // false
```
