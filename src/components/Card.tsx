import { Box, Code, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

interface CardProps {
  front: JSX.Element;
  back: JSX.Element;
  bgImage: string;
}

const Card: React.FC<CardProps> = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      w="100%"
      h="100%"
      position="relative"
      onMouseEnter={handleCardFlip}
      onMouseLeave={handleCardFlip}
      // transform={isFlipped ? 'rotateY(180deg)' : 'none'}
      transition="transform 0.6s"
      style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      className="frame"
    >
      <Flex
        w="full"
        h="full"
        direction="column"
        // justifyContent="center"
        alignItems="center"
        justifyContent="space-between"
      >
        {front}
        <Code pt={3} textAlign="justify" fontSize={12} p={2}>
          {back}
        </Code>
      </Flex>
    </Box>
  );
};

export default Card;
