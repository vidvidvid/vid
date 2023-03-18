import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { GithubIcon } from './icons/GithubIcon';

interface Props {
  image: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
}

const CodeCard = ({
  image,
  name,
  description,
  githubLink,
  websiteLink,
}: Props) => {
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  const hoverColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Link
      href={websiteLink ?? '#'}
      isExternal={!!websiteLink}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        transition="all 0.2s"
        _hover={{
          transform: 'scale(1.02)',
          boxShadow: 'xl',
          bg: hoverBg,
          color: hoverColor,
        }}
        w="full"
        h="full"
      >
        <Flex align="center" justify="space-between" h="full" p={6}>
          <Image
            src={`/assets/code/${image}`}
            alt={name}
            objectFit="contain"
            w={120}
            h={120}
            mr={8}
          />

          <Box>
            <Flex alignItems="center">
              <Link href={websiteLink} isExternal>
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  mr="2"
                  _hover={{
                    // add random color each time its hovered
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  }}
                >
                  {name}
                </Text>
              </Link>
              {githubLink && (
                <Link
                  href={githubLink}
                  isExternal
                  transition="all 0.2s"
                  _hover={{
                    // add random color each time its hovered
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    transform: 'scale(1.2)',
                  }}
                >
                  <GithubIcon />
                </Link>
              )}
            </Flex>

            <Text mt="4" fontSize={14}>
              {description}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default CodeCard;
