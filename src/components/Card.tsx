import { Box, Code, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface CardProps {
  element: JSX.Element;
  description: String;
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
    <Box
      alignItems="center"
      justifyContent="center"
      id={`image-${index.toString()}`}
      w="100%"
      h="100%"
      position="relative"
      className="frame"
    >
      <Flex
        w="full"
        h="full"
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        {element}
        <Code pt={3} textAlign="justify" fontSize={12} p={2} color="black">
          {description}
        </Code>
      </Flex>
    </Box>
  );
};

export default Card;
