import React, { useEffect, useRef } from 'react';

import BlogPostItem from '@theme-original/BlogPostItem';

// @ts-expect-error internal code
import { useColorMode } from '@docusaurus/theme-common';
import { useBlogPost } from '@docusaurus/theme-common/internal';

const giscusSelector = 'iframe.giscus-frame';

export default function BlogPostItemWrapper(props) {
  const { colorMode } = useColorMode();
  const { isBlogPostPage } = useBlogPost();
  const giscusTheme = colorMode === 'dark' ? 'dark' : 'light';
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isBlogPostPage) return;

    const giscusEl = containerRef.current.querySelector(giscusSelector);

    const createGiscusEl = () => {
      const script = document.createElement('script');

      script.src = 'https://giscus.app/client.js';
      script.setAttribute('data-repo', 'ctdlog/ctdlog.github.io');
      script.setAttribute('data-repo-id', 'R_kgDOK7up_g');
      script.setAttribute('data-category', 'Announcements');
      script.setAttribute('data-category-id', 'DIC_kwDOK7up_s4Cb5p5');
      script.setAttribute('data-mapping', 'pathname');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '0');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'bottom');
      script.setAttribute('data-theme', giscusTheme);
      script.setAttribute('data-lang', 'ko');
      script.crossOrigin = 'anonymous';
      script.async = true;

      containerRef.current.appendChild(script);
    };

    const postThemeMessage = () => {
      const message = {
        setConfig: {
          theme: giscusTheme,
        },
      };

      giscusEl.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    };

    giscusEl ? postThemeMessage() : createGiscusEl();
  }, [giscusTheme]);

  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && <div ref={containerRef} />}
    </>
  );
}
