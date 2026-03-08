import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import styles from './Main.module.css';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  return (
    <div
      style={{
        height: isHome ? '100vh' : 'auto',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {props.meta}

      {!isHome && (
        <div className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/code">Code</Link>
          <Link href="/music">Music</Link>
          <Link href="/imagery">Imagery</Link>
          <Link href="/words">Words</Link>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: isHome ? '100%' : 'auto',
          minHeight: isHome ? '100%' : undefined,
          justifyContent: 'center',
          alignItems: isHome ? 'center' : 'stretch',
          flexDirection: 'column',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export { Main };
