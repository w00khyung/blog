---
sidebar_position: 1
---

# TypeScript Style Guide

:::info

[TypeScript Style Guide](https://mkosir.github.io/typescript-style-guide/)를 한국어로 번역했습니다.

:::

## 타입(Types)

### Type Inference

- 경험상, 타입을 좁히는 데 도움이 되는 경우 타입을 명시적으로 선언하는 것이 좋습니다.
- 타입을 추가할 필요가 없다고 해서 추가하지 않아도 된다는 의미는 아닙니다. 경우에 따라 명시적인 타입 선언이 코드 가독성과 의도를 향상시킬 수 있습니다.

```tsx
// ❌ Avoid - Type can be inferred
const userRole: string = 'admin'; // Type 'string'
const employees = new Map<string, number>([['gabriel', 32]]);
const [isActive, setIsActive] = useState<boolean>(false);

// ✅ Use
const USER_ROLE = 'admin'; // Type 'admin'
const employees = new Map([['gabriel', 32]]); // Type 'Map<string, number>'
const [isActive, setIsActive] = useState(false); // Type 'boolean'

// ❌ Avoid - Type can be narrowed
const employees = new Map(); // Type 'Map<any, any>'
employees.set('lea', 'foo-anything');
type UserRole = 'admin' | 'guest';
const [userRole, setUserRole] = useState('admin'); // Type 'string'

// ✅ Use
const employees = new Map<string, number>(); // Type 'Map<string, number>'
employees.set('gabriel', 32);
type UserRole = 'admin' | 'guest';
const [userRole, setUserRole] = useState<UserRole>('admin'); // Type 'UserRole'
```

### Return Types

- 반환 타입을 명시하는 것을 적극 권장하지만, 필수는 아닙니다. ([eslint rule](https://typescript-eslint.io/rules/explicit-function-return-type/))
- 반환 타입을 명시하면 다음과 같은 장점이 있습니다.

  - 반환값을 사용하면 모든 호출 코드에서 어떤 유형이 반환되는지 명확하고 쉽게 이해할 수 있습니다.
  - **반환 값이 없는 경우(void), 호출 코드는 정의되지 않은 값을 사용해서는 안 되는 경우 이를 사용하려고 시도하지 않습니다.**

  ```tsx
  function doSomething(): void {
    console.log('Doing something');
  }

  const result = doSomething(); // 에러: Type 'void' is not assignable to type 'any'.
  ```

  - 함수의 반환 타입을 변경하는 코드 변경이 있는 경우, 향후 잠재적인 타입 오류를 더 빨리 발견할 수 있습니다.
  - 반환 값이 올바른 유형의 변수에 할당되도록 보장하므로 리팩터링이 더 쉬워집니다.
  - 구현 전 테스트 작성(TDD)과 유사하게 함수 인수와 반환 유형을 정의하면 구현에 앞서 기능의 기능과 인터페이스에 대해 논의할 수 있습니다.
  - 타입 추론은 매우 편리하지만 반환 타입을 추가하면 TypeScript 컴파일러의 작업을 많이 줄일 수 있습니다.

### Template Literal Types

- 문자열 타입 대신 템플릿 리터럴 타입을 사용하세요. 템플릿 리터럴 유형에는 API 엔드포인트, 라우팅, 국제화, 데이터베이스 쿼리, CSS 타이핑 등 적용 가능한 사용 사례가 많습니다.

```tsx
// ❌ Avoid
const userEndpoint = '/api/usersss'; // Type 'string' - no error
// ✅ Use
type ApiRoute = 'users' | 'posts' | 'comments';
type ApiEndpoint = `/api/${ApiRoute}`;
const userEndpoint: ApiEndpoint = '/api/users';

// ❌ Avoid
const homeTitleTranslation = 'transltion.hom.title'; // Type 'string' - no error
// ✅ Use
type LocaleKeyPages = 'home' | 'about' | 'contact';
type TranslationKey = `translation.${LocaleKeyPages}.${string}`;
const homeTitleTranslation: TranslationKey = 'translation.home.title';

// ❌ Avoid
const color = 'blue-450'; // Type 'string' - no error
// ✅ Use
type BaseColor = 'blue' | 'red' | 'yellow' | 'gray';
type Variant = 50 | 100 | 200 | 300 | 400;
// Type blue-50, blue-100, blue-200, blue-300, blue-400, red-50, red-100, #AD3128 ...
type Color = `${BaseColor}-${Variant}` | `#${string}`;
```

### Type any & unknown

- `any`데이터 타입은 TypeScript가 기본값으로 사용하는 문자 그대로 "모든" 값을 나타내며 유형을 유추할 수 없으므로 유형 검사를 생략하므로 사용해서는 안 됩니다. 또한, `any`는 심각한 프로그래밍 오류를 가릴 수 있으므로 위험합니다.
- 모호한 데이터 유형을 처리할 때는 `any`에 대응하는 유형 안전성이 있는 `unknown`을 사용하세요.
- **`unknown`** 타입은 모든 프로퍼티에 대한 참조를 허용하지 않습니다. **`unknown`**은 어떤 값이든 할당할 수 있/지만, **`unknown`** 자체는 다른 타입에 할당할 수 없습니다.

```tsx
// unknown 타입의 변수에 직접적인 프로퍼티 참조가 허용되지 않음.
let myVariable: unknown;
console.log(myVariable.someProperty); // 에러: Property 'someProperty' does not exist on type 'unknown'.
```

```tsx
// unknown에는 어떤 값이든 할당할 수 있음.
let myVariable: unknown;
myVariable = 10; // 가능
myVariable = 'Hello'; // 가능
```

```tsx
// 그러나, unknown 자체는 어떤 타입에도 할당 될 수 없음.
// 즉, unknown을 다른 타입으로 바로 할당하려면 타입을 명시적으로 지정해주어야 함.
let myNumber: number;
myNumber = myVariable; // 에러: Type 'unknown' is not assignable to type 'number'.
```

### Type & Non-nullability Assertions

- 타입 단언 (`user as User`)과 **Non-nullability Assertions** (`user!.name`)은 안전하지 않습니다. 이 두 가지는 TypeScript 컴파일러를 조용히 만들고 런타임에서 애플리케이션 충돌의 위험을 증가시킵니다. 이들은 강력한 이유가 있는 예외적인 상황에서만 사용해야 합니다 (예: 타사 라이브러리의 타입 불일치, unknown을 참조할 때 등).

```tsx
type User = { id: string; username: string; avatar: string | null };
// ❌ Avoid type assertions
const user = { name: 'Nika' } as User;
// ❌ Avoid non-nullability assertions
renderUserAvatar(user!.avatar); // Runtime error

const renderUserAvatar = (avatar: string) => {...}
```

### Type Error

- 만약 TypeScript 오류를 해결할 수 없다면, 마지막 수단으로 **`@ts-expect-error`**를 사용하여 해당 오류를 억제하세요 ([eslint rule](https://typescript-eslint.io/rules/prefer-ts-expect-error/)).
- 만약 나중에 억제된 부분이 오류가 없어진다면 TypeScript 컴파일러가 알려줄 것입니다. **`@ts-ignore`**은 허용되지 않지만, **`@ts-expect-error`**는 제공된 설명과 함께 사용할 수 있습니다 ([eslint rule](https://typescript-eslint.io/rules/ban-ts-comment/#allow-with-description)).

```tsx
// ❌ Avoid @ts-ignore
// @ts-ignore
const result = doSomething('hello');

// ✅ Use @ts-expect-error with description
// @ts-expect-error: The library definition is wrong, doSomething accepts string as an argument.
const result = doSomething('hello');
```

### Type Definition

- TypeScript은 두 가지 타입 정의 옵션을 제공합니다 - **`type`**과 **`interface`**. 이들은 대부분의 경우에 몇 가지 기능적인 차이를 가지지만 대부분의 상황에서는 서로 교환해서 사용할 수 있습니다. 우리는 문법의 차이를 최소화하고 일관성을 유지하기 위해 하나를 선택하려고 노력합니다.
- 모든 타입은 타입 별칭(**`type`**)을 사용하여 정의되어야 합니다 ([eslint rule)](https://typescript-eslint.io/rules/consistent-type-definitions/#type).

```tsx
// ❌ Avoid interface definitions
interface UserRole = 'admin' | 'guest'; // invalid - interface can't define (commonly used) type unions

interface UserInfo {
  name: string;
  role: 'admin' | 'guest';
}

// ✅ Use type definition
type UserRole = 'admin' | 'guest';

type UserInfo = {
  name: string;
  role: UserRole;
};
```

- 선언 병합(declaration merging)의 경우(예: 제3자 라이브러리 유형 확장), **`interface`**를 사용하고 lint 규칙을 비활성화하세요.

```tsx
// types.ts
declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;
    CUSTOM_ENV_VAR: string;
  }
}

// server.ts
app.listen(process.env.PORT, () => {...}
```

### Array Types

- 배열 타입은 제네릭 구문을 사용하여 정의되어야 합니다. ([eslint rule](https://typescript-eslint.io/rules/array-type/#generic))

```tsx
// ❌ Avoid
const x: string[] = ['foo', 'bar'];
const y: readonly string[] = ['foo', 'bar'];

// ✅ Use
const x: Array<string> = ['foo', 'bar'];
const y: ReadonlyArray<string> = ['foo', 'bar'];
```

## 함수(Functions)

- 함수 컨벤션은 가능한 한 많이 따라야 합니다. (일부 규칙은 함수형 프로그래밍 기본 개념에서 파생되었습니다.)

### General

- 단일 책임 원칙을 따라야 합니다
- 상태가 없어야 하며, 동일한 입력에 대해 항상 동일한 값을 반환해야 합니다
- 최소한 하나의 인자를 받아들이고 데이터를 반환해야 합니다
- 부수 효과가 없어야 하며 순수(pure)해야 합니다

### Single Object Arg

- 함수를 가독성 있게 유지하고 미래에 확장 가능하게 유지하려면 (인수 추가/제거), 여러 개의 인수 대신 함수의 단일 객체를 인수로 사용하도록 노력하세요. 예외적으로 이 규칙은 하나의 기본 단일 인수만 있는 경우에 적용되지 않습니다 (예: 간단한 함수 **`isNumber(value)`**, 커링 구현 등).

```tsx
// ❌ Avoid having multiple arguments
transformUserInput('client', false, 60, 120, null, true, 2000);

// ✅ Use options object as argument
transformUserInput({
  method: 'client',
  isValidated: false,
  minLines: 60,
  maxLines: 120,
  defaultInput: null,
  shouldLog: true,
  timeout: 2000,
});
```

### Required & Optional Args

- 대부분의 매개변수를 필수로 지정하고 선택적인 매개변수는 삼가하려고 노력하세요. 함수가 너무 복잡해지면 아마도 그 함수를 더 작은 조각으로 나누는 것이 좋을 것입니다. 10개의 함수를 구현하되 각 함수당 5개의 필수 매개변수를 사용하는 것이, 하나의 "모든 것을 할 수 있는" 함수를 구현하되 50개의 선택적 매개변수를 사용하는 것보다 나은 과장된 예시입니다.

### Args as Discriminated Union

- 적용 가능한 경우, Discriminated Union 타입을 사용하여 선택적 매개변수를 제거하십시오. 이렇게 하면 함수 API의 복잡성이 감소하며 사용 사례에 따라 필요한/필수인 매개변수만 전달됩니다.

```tsx
// ❌ Avoid optional args as they increase complexity of function API
type StatusParams = {
  data?: Products;
  title?: string;
  time?: number;
  error?: string;
};

// ✅ Strive to have majority of args required, if that's not possible,
// use discriminated union for clear intent on function usage
type StatusParamsSuccess = {
  status: 'success';
  data: Products;
  title: string;
};

type StatusParamsLoading = {
  status: 'loading';
  time: number;
};

type StatusParamsError = {
  status: 'error';
  error: string;
};

type StatusParams = StatusSuccess | StatusLoading | StatusError;

export const parseStatus = (params: StatusParams) => {...
```

## 변수 (Variables)

### Const Assertion

- **`const`** 단언(const assertion)을 사용하도록 노력하세요.
  - 타입이 좁혀집니다(narrowed)
  - 객체에는 읽기 전용 속성이 생깁니다
  - 배열은 읽기 전용 튜플이 됩니다

```tsx
// ❌ Avoid declaring constants without const assertion
const FOO_LOCATION = { x: 50, y: 130 }; // Type { x: number; y: number; }
FOO_LOCATION.x = 10;
const BAR_LOCATION = [50, 130]; // Type number[]
BAR_LOCATION.push(10);
const RATE_LIMIT = 25;
// RATE_LIMIT_MESSAGE type - string
const RATE_LIMIT_MESSAGE = `Rate limit exceeded! Max number of requests/min is ${RATE_LIMIT}.`;

// ✅ Use const assertion
const FOO_LOCATION = { x: 50, y: 130 } as const; // Type '{ readonly x: 50; readonly y: 130; }'
FOO_LOCATION.x = 10; // Error
const BAR_LOCATION = [50, 130] as const; // Type 'readonly [10, 20]'
BAR_LOCATION.push(10); // Error
const RATE_LIMIT = 25;
// RATE_LIMIT_MESSAGE type - 'Rate limit exceeded! Max number of requests/min is 25.'
const RATE_LIMIT_MESSAGE = `Rate limit exceeded! Max number of requests/min is ${RATE_LIMIT}.` as const;
```

- `exhaustiveness check`, TypeScript에서 스위치문이나 타입 판별 구조에서 모든 가능한 타입 값들을 다루고 있는지 확인하는 기능입니다. ([eslint rule](https://typescript-eslint.io/rules/switch-exhaustiveness-check/))

```tsx
const shapes = [
  { kind: 'square', size: 7 },
  { kind: 'rectangle', width: 12, height: 6 },
  { kind: 'circle', radius: 23 },
] as const;

type Shape = (typeof shapes)[number];

const getShapeArea = (shape: Shape) => {
  // Error - Switch is not exhaustive. Cases not matched: "circle"
  switch (shape.kind) {
    case 'square':
      return shape.size * shape.size;
    case 'rectangle':
      return shape.width * shape.size; // Error - Property 'size' does not exist on type 'rectangle'
  }
};
```

### Enums & Const Assertion

- **`const`** 단언은 열거형(enum) 대신 사용되어야 합니다.
  - 열거형은 여전히 **`const`** 단언이 수행하는 역할을 수행할 수 있지만, 대개 피하는 경향이 있습니다. TypeScript 문서에서 언급된 몇 가지 이유는 다음과 같습니다: "[Const enum pitfalls](https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls)" (const 열거형의 함정), "[Objects vs Enums](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums)" (객체 vs 열거형), "[Reverse mappings](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings)" (역 매핑) 등.

```tsx
// ❌ Avoid using enums
enum UserRole {
  GUEST,
  MODERATOR,
  ADMINISTRATOR,
}

enum Color {
  PRIMARY = '#B33930',
  SECONDARY = '#113A5C',
  BRAND = '#9C0E7D',
}

// ✅ Use const assertion
const USER_ROLES = ['guest', 'moderator', 'administrator'] as const;
type UserRole = (typeof USER_ROLES)[number]; // Type "guest" | "moderator" | "administrator"

// Use satisfies if UserRole type is already defined - e.g. database schema model
type UserRoleDB = ReadonlyArray<'guest' | 'moderator' | 'administrator'>;
const AVAILABLE_ROLES = ['guest', 'moderator'] as const satisfies UserRoleDB;

const COLOR = {
  primary: '#B33930',
  secondary: '#113A5C',
  brand: '#9C0E7D',
} as const;
type Color = typeof COLOR;
type ColorKey = keyof Color; // Type "PRIMARY" | "SECONDARY" | "BRAND"
type ColorValue = Color[ColorKey]; // Type "#B33930" | "#113A5C" | "#9C0E7D"
```

### Null & Undefined

- TypeScript에서 **`null`**과 **`undefined`**는 많은 경우에 서로 교환하여 사용될 수 있습니다. 다음과 같은 가이드라인을 따라 노력하세요.
  - **null 사용**
    - 명시적으로 값이 없음을 나타낼 때 **`null`**을 사용하세요. 이는 변수에 할당하거나 함수의 반환 타입 등에서 명시적으로 사용될 수 있습니다.
  - **undefined 사용**
    - 값이 존재하지 않을 때 **`undefined`**를 사용하세요. 예를 들어, 폼의 필드를 제외하거나 요청 페이로드, 데이터베이스 쿼리 ([Prisma의 경우](https://www.prisma.io/docs/concepts/components/prisma-client/null-and-undefined))에서 값이 없음을 나타낼 때 **`undefined`**를 사용하세요.

## 이름 짓기(Naming)

- 일관되고 가독성 있고 중요한 컨텍스트를 제공하는 네이밍 컨벤션을 유지하려고 노력하세요. 왜냐하면 다른 사람이 여러분이 작성한 코드를 유지보수할 것이기 때문입니다.

### Named Export

- 명명된 내보내기(named exports)를 사용하여 모든 가져오기(import)가 균일한 패턴을 따르도록 보장해야 합니다 ([eslint rule](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-default-export.md)).
- 이를 통해 변수, 함수 등의 이름이 전체 코드베이스에서 일관되게 유지됩니다.
- 명명된 내보내기를 사용하면 가져오기 문에서 선언되지 않은 것을 가져오려고 할 때 오류가 발생하는 장점이 있습니다.
- 예외적인 상황, 예를 들면 Next.js 페이지와 같은 경우에는 규칙을 비활성화하세요.

```tsx
// .eslintrc.js
overrides: [
  {
    files: ["src/pages/**/*"],
    rules: { "import/no-default-export": "off" },
  },
],
```

### Naming Conventions

- 좋은 이름을 찾는 것은 종종 어렵지만, 일관성과 미래의 독자를 위해 코드를 최적화하려면 규칙을 따르세요

**변수 (Variables)**

- **로컬 변수 (Locals)**
  - 카멜 케이스(camel case)를 사용하세요.
  - 예: **`products`**, **`productsFiltered`**
- **불리언 (Booleans)**
  - **`is`**, **`has`** 등의 접두사를 사용하세요.
  - 예: **`isDisabled`**, **`hasProduct`**
- **상수 (Constants)**
  - 대문자로 표기하세요.
  - 예: **`PRODUCT_ID`**
- **객체 상수 (Object Constants)**
  - 단수형으로 표기하고 대문자로 시작하며 **`const`** 단언을 사용하세요. 선택적으로 타입을 만족하는 경우 (타입이 존재하는 경우) **`satisfies`**를 사용하세요.
  ```tsx
  const ORDER_STATUS = {
    pending: 'pending',
    fulfilled: 'fulfilled',
    error: 'error',
  } as const satisfies OrderStatus;
  ```

**함수 (Functions)**

- 카멜 케이스(camel case)를 사용하세요.
- 예: **`filterProductsByType`**, **`formatCurrency`**

**제네릭스 (Generics)**

- 대문자 T로 시작하는 이름을 사용하세요. **`.Net`** 내부 구현과 유사합니다.
- 한 문자로 된 제네릭 이름 (**`T`**, **`K`** 등)은 피하세요. 변수를 도입할수록 혼란이 생길 가능성이 높아집니다.

```tsx
// ❌ 한 문자로 된 제네릭 이름 사용
const createPair = <T, K extends string>(first: T, second: K): [T, K] => {
  return [first, second];
};
const pair = createPair(1, 'a');

// ✅ 대문자 T로 시작하는 이름 사용
const createPair = <TFirst, TSecond extends string>(first: TFirst, second: TSecond): [TFirst, TSecond] => {
  return [first, second];
};
const pair = createPair(1, 'a');
```

- [Eslint rule](https://typescript-eslint.io/rules/naming-convention) implements

```tsx
// .eslintrc.js
'@typescript-eslint/naming-convention': [
  'error',
  {
    selector: 'typeParameter',
    format: ['PascalCase'],
    custom: { regex: '^T[A-Z]', match: true },
  },
],
```

**약어 및 머릿말 (Abbreviations & Acronyms)**

- 약어 및 머릿말은 전체 단어처럼 다루며 첫 글자만 대문자로 적용하세요.

```tsx
// ❌ 약어 사용 예
const FAQList = ['qa-1', 'qa-2'];
const generateUserURL = (params) => {...};

// ✅ 약어 사용 예시
const FaqList = ['qa-1', 'qa-2'];
const generateUserUrl = (params) => {...};
```

- **가독성을 위해 약어를 피하라**
  - 약어는 일반적으로 널리 알려지고 필요한 경우를 제외하고는 가독성을 위해 피하도록 노력하세요.

```tsx
// ❌ 약어 사용 예
const GetWin = (params) => {...};

// ✅ 약어 사용하지 않은 예시
const GetWindow = (params) => {...};
```

**React 컴포넌트 (React Components)**

- 파스칼 케이스(Pascal case)를 사용하세요.
- 예: **`ProductItem`**, **`ProductsPage`**

**프롭 타입 (Prop Types)**

- React 컴포넌트 이름 뒤에 "Props" 접미사를 사용하세요.
- **`[컴포넌트이름]Props`** - **`ProductItemProps`**, **`ProductsPageProps`**

**콜백 프롭 (Callback Props)**

- 이벤트 핸들러 콜백 프롭은 **`on*`**로 접두사를 붙입니다. 예: **`onClick`**.
- 이벤트 핸들러 구현 함수는 **`handle*`**로 접두사를 붙입니다 ([eslint rule](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md)).

```tsx
// ❌ 일관성 없는 콜백 프롭 네이밍 피하기
<Button click={actionClick} />
<MyComponent userSelectedOccurred={triggerUser} />

// ✅ prop 접두사 'on*' 및 핸들러 접두사 'handle*' 사용
<Button onClick={handleClick} />
<MyComponent onUserSelected={handleUserSelected} />
```

**React Hooks (리액트 훅스)**

- 카멜 케이스(camel case)를 사용하고, 'use'로 접두사를 붙입니다 ([eslint rule](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)). **`useState()`**의 경우 [value, setValue]와 같은 대칭적인 패턴을 따릅니다 ([eslint rule](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md#rule-details)).

```jsx
// ❌ 일관성 없는 useState 훅 네이밍 피하기
const [userName, setUser] = useState();
const [color, updateColor] = useState();
const [isActive, setActive] = useState();

// ✅ 사용
const [name, setName] = useState();
const [color, setColor] = useState();
const [isActive, setIsActive] = useState();
```

**커스텀 훅 (Custom Hooks)**

- 커스텀 훅은 항상 객체를 반환해야 합니다.

```jsx
// ❌ 객체를 반환하지 않는 커스텀 훅 피하기
const [products, errors] = useGetProducts();
const [fontSizes] = useTheme();

// ✅ 사용
const { products, errors } = useGetProducts();
const { fontSizes } = useTheme();
```

**주석 (Comments)**

- 일반적으로 주석을 피하되, 코드 자체를 표현하고 이름을 명확하게 사용하여 주석을 필요 없게 하세요.
- 코드로 표현할 수 없는 선택 사항이나 컨텍스트를 추가해야 할 때 주석을 사용하세요 (예: 설정 파일).
- 주석은 항상 완전한 문장으로 작성되어야 합니다. 주석에서는 어떻게(how)와 무엇(what)보다 왜(why)를 설명하는 것이 좋습니다.

```tsx
// ❌ 피하기: 주석이 필요한 부분을 코드로 표현하기
// 분 단위로 변환
const m = s * 60;
// 분당 평균 사용자 수
const myAvg = u / m;

// ✅ 사용: 코드를 통해 왜를 설명하기
const SECONDS_IN_MINUTE = 60;
const minutes = seconds * SECONDS_IN_MINUTE;
const averageUsersPerMinute = noOfUsers / minutes;

// TODO: 필터링은 API 변경이 릴리스된 후 백엔드로 이동해야 합니다.
// 이슈/PR - https://github.com/foo/repo/pulls/55124
const filteredUsers = frontendFiltering(selectedUsers);

// 푸리에 변환 사용하여 정보 손실 최소화 - https://github.com/dntj/jsfft#usage
const frequencies = signal.FFT();
```

## Source Organization

### Code Collocation

- 모노레포(monorepo) 내의 각 응용 프로그램이나 패키지는 기능에 따라 프로젝트 파일/폴더를 조직하고 그룹화합니다.
- 코드를 가능한 한 관련된 위치에 가깝게 두세요.
- 깊게 중첩된 폴더는 문제가 되지 않아야 합니다.

### Imports

- Import 경로는 상대 경로로 시작하는 **`./`** 또는 **`../`**일 수 있고, 또는 절대 경로인 **`@common/utils`**일 수 있습니다.

**가독성을 높이기 위한 Import 가이드**

- Import 문을 더 가독성 있고 이해하기 쉽게 만들기 위해 다음 가이드를 따르세요.
  1. **상대적인 Import 사용**
     - 동일한 기능 내에서 서로 '가까운' 파일을 가져올 때는 상대적인 Import **`./`**을 사용하세요. 이로써 코드베이스에서 기능을 이동하더라도 이러한 Import 문에 변경이 필요하지 않게 됩니다.
  2. **절대적인 Import 사용**
     - 다른 모든 경우에는 절대적인 Import **`@common/utils`**를 사용하세요.
  3. **툴링에 의한 자동 정렬 사용**
     - 모든 Import는 툴링(예: `prettier-plugin-sort-imports`, `eslint-plugin-import`)에 의해 자동으로 정렬되어야 합니다.

```tsx
// ❌ 피하기: 거리가 먼 상대 경로 Import
import { bar, foo } from '../../../../../../distant-folder';

// ✅ 사용: 상대 경로 및 절대 경로 Import 혼용
import { locationApi } from '@api/locationApi';

import { foo } from '../../foo';
import { bar } from '../bar';
import { baz } from './baz';
```

### Project Structure

- 각 응용 프로그램이 다음과 같은 파일/폴더 구조를 가지고 있는 예시 프론트엔드 모노레포 프로젝트

```tsx
apps/
├─ product-manager/
│  ├─ common/
│  │  ├─ components/
│  │  │  ├─ Button/
│  │  │  ├─ ProductTitle/
│  │  │  ├─ ...
│  │  │  └─ index.tsx
│  │  ├─ consts/
│  │  │  ├─ paths.ts
│  │  │  └─ ...
│  │  ├─ hooks/
│  │  └─ types/
│  ├─ modules/
│  │  ├─ HomePage/
│  │  ├─ ProductAddPage/
│  │  ├─ ProductPage/
│  │  ├─ ProductsPage/
│  │  │  ├─ api/
│  │  │  │  └─ useGetProducts/
│  │  │  ├─ components/
│  │  │  │  ├─ ProductItem/
│  │  │  │  ├─ ProductsStatistics/
│  │  │  │  └─ ...
│  │  │  ├─ utils/
│  │  │  │  └─ filterProductsByType/
│  │  │  └─ index.tsx
│  │  ├─ ...
│  │  └─ index.tsx
│  ├─ eslintrc.js
│  ├─ package.json
│  └─ tsconfig.json
├─ warehouse/
├─ admin-dashboard/
└─ ...
```

- **`modules`** 폴더는 각 개별 페이지의 구현을 담당하며 해당 페이지에 대한 모든 사용자 정의 기능 (컴포넌트, 훅, 유틸리티 함수 등)이 구현됩니다.
- **`common`** 폴더는 실제로 응용 프로그램 전체에서 사용되는 구현을 담당합니다. "전역 폴더"이기 때문에 절약해서 사용해야 합니다. 예를 들어, 동일한 컴포넌트 (예: **`common/components/ProductTitle`**)가 여러 페이지에서 사용되기 시작하면 이를 **`common`** 폴더로 이동해야 합니다.
- 프론트엔드 프레임워크에서 파일 시스템 기반 라우터를 사용하는 경우 (예: Next.js), **`pages`** 폴더는 라우터의 역할을 수행하며, 해당 폴더의 주요 책임은 라우트를 정의하는 것입니다. 이 폴더에서는 비즈니스 로직의 구현은 이뤄지지 않습니다.

## Appendix - React

- React 컴포넌트와 훅도 함수이기 때문에 관련된 함수 규칙이 적용됩니다.

### Required & Optional Props

- 대부분의 Props를 필수로 가져가도록 노력하고, 선택적인 Props는 삼가거나 신중하게 사용하세요.
- 특히 처음이나 단일 사용 사례에 대한 새로운 컴포넌트를 작성할 때는 대부분의 Props를 필수로 지정하는 것이 좋습니다. 컴포넌트가 더 많은 사용 사례를 다루기 시작하면 선택적인 Props를 도입하세요.
- 컴포넌트 API가 처음부터 선택적인 Props를 구현해야 하는 경우도 있습니다 (예: 여러 사용 사례를 다루는 공유 컴포넌트, UI 디자인 시스템 컴포넌트 - **`isDisabled`**와 같은 경우).
- 컴포넌트 또는 훅이 너무 복잡해지면 작은 조각으로 분할하는 것이 좋습니다.
- 예를 들어, 각각 5개의 필수 props를 가진 10개의 React 컴포넌트를 구현하는 것이 50개의 선택적 props를 허용하는 "모든 것을 할 수 있는" 하나의 컴포넌트를 구현하는 것보다 낫습니다.

### Props as Discriminated Type

- 적용 가능한 경우, Discriminated Type을 사용하여 선택적인 props를 제거하여 컴포넌트 API의 복잡성을 감소시키고 해당 사용 사례에 따라 필요한 props만 전달합니다.

```tsx
// ❌ 선택적인 props를 사용하는 것은 컴포넌트 API의 복잡성을 높일 수 있으므로 피하세요
type StatusProps = {
  data?: Products;
  title?: string;
  time?: number;
  error?: string;
};

// ✅ 대부분의 props를 필수로 가져가도록 노력하며, 그렇게 할 수 없는 경우에는
// discriminated union을 사용하여 컴포넌트 사용 목적을 명확히 표현하세요
type StatusSuccess = {
  status: 'success';
  data: Products;
  title: string;
};

type StatusLoading = {
  status: 'loading';
  time: number;
};

type StatusError = {
  status: 'error';
  error: string;
};

type StatusProps = StatusSuccess | StatusLoading | StatusError;

export const Status = (status: StatusProps) => {...

```

### Props To State

일반적으로 props를 상태로 사용하는 것은 피하는 것이 좋습니다. 왜냐하면 컴포넌트는 prop의 변경으로 업데이트되지 않기 때문에 추적하기 어려운 버그, 의도하지 않은 부작용, 테스트의 어려움 등을 야기할 수 있습니다.
초기 상태에 prop을 사용해야 하는 경우 해당 prop은 `initial`접두어로 지정되어야 합니다 (예: `initialProduct`, `initialSort`등).

```tsx
// ❌ props를 상태로 사용하는 것을 피하세요
type FooProps = {
  productName: string;
  userId: string;
};

export const Foo = ({ productName, userId }: FooProps) => {
  const [productName, setProductName] = useState(productName);
  ...
};

// ✅ 합당한 사용 사례가 있는 경우 prop에 `initial` 접두어 사용
type FooProps = {
  initialProductName: string;
  userId: string;
};

export const Foo = ({ initialProductName, userId }: FooProps) => {
  const [productName, setProductName] = useState(initialProductName);
  ...
};
```

### Props Type

```tsx
// ❌ Avoid using React.FC type
type FooProps = {
  name: string;
  score: number;
};

export const Foo: React.FC<FooProps> = ({ name, score }) => {

// ✅ Use props argument with type
type FooProps = {
  name: string;
  score: number;
};

export const Foo = ({ name, score }: FooProps) => {...
```

### Component Types

Container

- 모든 컨테이너 컴포넌트는 "Container" 또는 "Page" 접미사를 가져야 합니다. **`[ComponentName]Container|Page`** 형식입니다. "Page" 접미사를 사용하여 실제 웹 페이지임을 나타냅니다.
- 각 기능은 컨테이너 컴포넌트를 가져야 합니다 (예: **`AddUserContainer.tsx`**, **`EditProductContainer.tsx`**, **`ProductsPage.tsx`** 등).
- 비즈니스 로직 및 API 통합이 포함됩니다.
- 구조

```tsx
ProductsPage/
├─ api/
│  └─ useGetProducts/
├─ components/
│  └─ ProductItem/
├─ utils/
│  └─ filterProductsByType/
└─ index.tsx
```

UI - Feature

- 기능 요구 사항을 충족시키기 위해 설계된 표현 컴포넌트입니다.
- 컨테이너 컴포넌트 폴더 안에 중첩되어 있어야 합니다.
- 가능한 한 함수 규칙을 따라야 합니다.
- API 통합이 없어야 합니다.
- 구조

```tsx
ProductItem/
├─ index.tsx
├─ ProductItem.stories.tsx
└─ ProductItem.test.tsx
```

UI - Design system

- 코드베이스 전체에서 사용되는 전역 재사용/공유 컴포넌트입니다.

```tsx
Button/
├─ index.tsx
├─ Button.stories.tsx
└─ Button.test.tsx
```

### Store & Pass Data

- 특히 필터링, 정렬 등을 위해 상태를 URL에 저장하는 것이 좋습니다.
- URL 상태를 로컬 상태와 동기화하지 마세요.
- 데이터를 단순히 props를 통해 전달하거나 URL, 자식 컴포넌트 조합을 고려하세요. 전역 상태(Zustand, Context)는 마지막 수단으로 사용하세요.
- 컴포넌트가 함께 속하고 작동해야 할 때 React 복합 컴포넌트를 사용하세요.
  - 메뉴, 아코디언, 네비게이션, 탭, 목록 등
- 항상 복합 컴포넌트를 다음과 같이 내보내세요.

```tsx
// PriceList.tsx
const PriceListRoot = ({ children }) => <ul>{children}</ul>;
const PriceListItem = ({ title, amount }) => (
  <li>
    Name: {name} - Amount: {amount}
  </li>
);

// ❌
export const PriceList = {
  Container: PriceListRoot,
  Item: PriceListItem,
};
// ❌
PriceList.Item = Item;
export default PriceList;

// ✅
export const PriceList = PriceListRoot as typeof PriceListRoot & {
  Item: typeof PriceListItem;
};
PriceList.Item = PriceListItem;

// App.tsx
import { PriceList } from './PriceList';

<PriceList>
  <PriceList.Item title='Item 1' amount={8} />
  <PriceList.Item title='Item 2' amount={12} />
</PriceList>;
```

- **UI 컴포넌트**
  - 파생된 상태를 표시하고 이벤트를 전송해야 합니다.
  - 다른 프로그래밍 언어에서 함수 인수를 다음 함수로 전달할 수 있듯이 React 컴포넌트도 마찬가지로 프롭 드릴링이 문제가 되지 않아야 합니다.
  - 앱 확장으로 인해 prop drilling이 실제로 문제가 되는 경우 렌더 메서드를 리팩터링하거나 부모 컴포넌트에서 로컬 상태를 사용하거나 구성 등을 사용해야 합니다.
- **데이터 페칭은 컨테이너 컴포넌트에서만 허용됩니다:**
  - 서버 상태 라이브러리의 사용이 권장됩니다 ([react-query](https://github.com/tanstack/query), [apollo client](https://github.com/apollographql/apollo-client) 등).
  - 전역 상태에 대한 클라이언트 상태 라이브러리 사용은 권장되지 않습니다.
  - 어떤 것이 정말로 애플리케이션 전체에서 전역적이어야 하는지 다시 고려하세요 (예: themeMode, 권한 또는 서버 상태에 배치할 수 있는 사용자 설정과 같은 것 - /me 엔드포인트). 여전히 전역 상태가 정말로 필요한 경우 `Zustand`나 `Context`를 사용하세요.
