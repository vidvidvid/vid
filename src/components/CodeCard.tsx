import {
  Box,
  Flex,
  Image,
  keyframes,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { GithubIcon } from './icons/GithubIcon';

interface Props {
  image?: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
}

const wobble = keyframes`
  0%, 100% { transform: rotate(-0.5deg); }
  50% { transform: rotate(0.5deg); }
`;

const borderHue = keyframes`
  0% { border-color: hsl(0, 80%, 60%); }
  25% { border-color: hsl(90, 80%, 60%); }
  50% { border-color: hsl(180, 80%, 60%); }
  75% { border-color: hsl(270, 80%, 60%); }
  100% { border-color: hsl(360, 80%, 60%); }
`;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 360) + 360) % 360;
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
  const fallbackHue = hashName(name);

  return (
    <Link
      href={websiteLink ?? '#'}
      isExternal={!!websiteLink}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        maxW="md"
        borderWidth="2px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        transition="all 0.3s cubic-bezier(.4,0,.2,1)"
        animation={`${wobble} 3s ease-in-out infinite, ${borderHue} 6s linear infinite`}
        _hover={{
          transform: 'scale(1.05) skew(-1deg, 0.5deg)',
          boxShadow: `0 0 20px hsl(${fallbackHue}, 100%, 60%), 0 0 40px hsl(${fallbackHue}, 80%, 40%)`,
          bg: hoverBg,
          color: hoverColor,
        }}
        w="full"
        h="full"
      >
        <Flex align="center" justify="space-between" h="full" p={6}>
          {image ? (
            <Image
              src={`/assets/code/${image}`}
              alt={name}
              objectFit="contain"
              w={120}
              h={120}
              mr={8}
              flexShrink={0}
            />
          ) : (
            <Flex
              w="120px"
              h="120px"
              minW="120px"
              mr={8}
              borderRadius="full"
              bg={`hsl(${fallbackHue}, 60%, 45%)`}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Text
                fontSize="4xl"
                fontWeight="bold"
                color="white"
                userSelect="none"
              >
                {name.charAt(0).toUpperCase()}
              </Text>
            </Flex>
          )}

          <Box flex={1}>
            <Flex alignItems="center">
              <Link href={websiteLink} isExternal>
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  mr="2"
                  _hover={{
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
