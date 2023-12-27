import { useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function HomepageFeatures(): JSX.Element {
  const [hover, setHover] = useState(false);

  return (
    <section className={styles.features}>
      <div className={clsx(styles.container)}>
        <div className={styles.profile__image}>
          <img src='/img/home_space.jpg' alt='GitHub Profile Image' />
        </div>
        <p className={styles.profile__description}>
          {' '}
          <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {hover ? <strong>기타</strong> : '🎸'}
          </span>
          와{' '}
          <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {hover ? <strong>우주</strong> : '🪐'}
          </span>
          {`를 좋아하는 주니어 개발자`}
        </p>
      </div>
    </section>
  );
}
