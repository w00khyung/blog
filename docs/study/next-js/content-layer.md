---
sidebar_position: 1
---

# Content-layer

- MD와 MDX의 차이점
  - Markdown (**`.md`**)와 MDX (**`.mdx`**)는 둘 다 마크업 언어의 확장자입니다. 그러나 이 둘 간에 몇 가지 중요한 차이점이 있습니다.
    1. **MDX는 React 컴포넌트를 지원합니다.**
       - MDX는 Markdown 문서 내에서 React 컴포넌트를 사용할 수 있게 하는 기능을 제공합니다. 이는 동적이고 인터랙티브한 콘텐츠를 마크다운 문서에 포함할 때 유용합니다. MDX는 JSX 문법을 지원하여 React 컴포넌트를 마크다운에 쉽게 통합할 수 있습니다.
    2. **MDX는 Front Matter를 지원합니다.**
       - MDX 파일은 YAML 또는 JSON 형식의 Front Matter를 포함할 수 있습니다. Front Matter는 문서에 대한 메타데이터를 제공하는 데 사용됩니다. 일반적으로 제목, 작성자, 날짜 등의 정보를 포함할 수 있습니다.
    3. **MDX는 Markdown을 확장한 형태입니다.**
       - MDX는 Markdown을 확장하여 React 컴포넌트를 지원하는 형태입니다. 따라서 기본적인 Markdown 구문과 기능은 MDX에서도 사용할 수 있습니다.
    4. **MDX는 일반적으로 웹 개발 환경에서 사용됩니다.**
       - MDX는 주로 웹 개발 및 프론트엔드 프로젝트에서 사용됩니다. React 컴포넌트를 마크다운에 통합하면 정적 사이트 생성기 (SSG) 및 프레임워크에서 더 유연한 콘텐츠 작성이 가능해집니다.

Markdown은 단순한 텍스트 기반의 마크업 언어이며, 보다 일반적인 텍스트 문서 작성에 사용됩니다. 일반적으로 블로그 게시물, 문서, README 파일 등을 작성할 때 Markdown이 많이 사용됩니다. MDX는 React 컴포넌트를 활용하여 더 동적이고 풍부한 콘텐츠를 표현할 수 있습니다.

- `rehype-highlight` 와 `remark-gfm` 은 최근 버전을 사용할 시에 `contentlayer` 라이브러리와 호환이 되지 않아서 각각 6.0.0, 3.0.1 버전으로 다운그레이드 해서 사용했다.
- MDX Component를 사용하기 위해서는 [useMDXComponent](https://contentlayer.dev/docs/reference/next-contentlayer-e6e7eb3a#usemdxcomponent) hook을 사용하면 된다.

  - MDX를 사용하기 위해서는 contentlayer.config.ts 파일에서 contentType을 mdx로 꼭 설정해줘야 한다.

  ```jsx
  export const Post = defineDocumentType(() => ({
    name: 'Post',
    **contentType: 'mdx',**
    filePathPattern: `**/*.mdx`,
    ...
  }));
  ```

- 참고

[Next.js에서 contentlayer 사용하여 손쉽게 정적블로그 만들기](https://yiyb-blog.vercel.app/posts/nextjs-contentlayer-blog)

[Next.js와 ContentLayer로 MDX 블로그 만들기 | Disquiet\*](https://disquiet.io/@woongsnote/makerlog/next-js와-content-layer로-mdx-블로그-만들기)
