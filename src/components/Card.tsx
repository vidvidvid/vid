import React, { useEffect } from 'react';

import styles from './Card.module.css';

interface CardProps {
  element: React.ReactElement;
  description: string;
  index: number;
}

const Card: React.FC<CardProps> = ({ element, description, index }) => {
  useEffect(() => {
    const colors = [
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
    ];

    const el = document.querySelector(
      `#image-${index.toString()}`
    ) as HTMLElement;
    el.style.setProperty('--color-1', colors[0] || 'red');
    el.style.setProperty('--color-2', colors[1] || 'blue');
    el.style.setProperty('--color-3', colors[2] || 'green');
    el.style.setProperty('--color-4', colors[3] || 'yellow');
    el.style.setProperty('--color-5', colors[4] || 'purple');
  }, []);

  return (
    <div
      className={`${styles.card} frame`}
      id={`image-${index.toString()}`}
    >
      <div className={styles.inner}>
        {element}
        <span className={styles.code}>{description}</span>
      </div>
    </div>
  );
};

export default Card;
