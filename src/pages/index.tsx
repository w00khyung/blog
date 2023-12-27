import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`안녕, 세상!`} description='개발, 서적, 일상 등 다양한 주제를 기록하는 블로그입니다.'>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
