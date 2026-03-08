import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';

import { GithubIcon } from './icons/GithubIcon';

interface Props {
  image?: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  current?: boolean;
  hobby?: boolean;
}

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
  current,
  hobby,
}: Props) => {
  const fallbackHue = hashName(name);

  return (
    <Link
      href={websiteLink ?? '#'}
      isExternal={!!websiteLink}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        borderWidth="1px"
        borderColor={
          current ? 'green.700' : hobby ? 'purple.800' : 'whiteAlpha.100'
        }
        borderRadius="xl"
        overflow="hidden"
        bg={current || hobby ? 'whiteAlpha.100' : 'whiteAlpha.50'}
        transition="all 0.25s ease"
        _hover={{
          transform: 'translateY(-4px)',
          borderColor: current
            ? 'green.500'
            : hobby
              ? 'purple.500'
              : 'whiteAlpha.300',
          bg: 'whiteAlpha.100',
          boxShadow: current
            ? '0 8px 30px rgba(45, 248, 199, 0.1)'
            : hobby
              ? '0 8px 30px rgba(199, 45, 248, 0.1)'
              : '0 8px 30px rgba(0, 0, 0, 0.3)',
        }}
        w="full"
        h="full"
      >
        <Flex align="center" h="full" p={5} gap={5}>
          {image ? (
            <Image
              src={`/assets/code/${image}`}
              alt={name}
              objectFit="contain"
              w="56px"
              h="56px"
              flexShrink={0}
              borderRadius="lg"
            />
          ) : (
            <Flex
              w="56px"
              h="56px"
              minW="56px"
              borderRadius="lg"
              bg={`hsl(${fallbackHue}, 40%, 30%)`}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="whiteAlpha.800"
                userSelect="none"
              >
                {name.charAt(0).toUpperCase()}
              </Text>
            </Flex>
          )}

          <Box flex={1} minW={0}>
            <Flex alignItems="center" gap={2}>
              <Text fontSize="md" fontWeight="semibold" color="whiteAlpha.900">
                {name}
              </Text>
              {current && (
                <Text
                  fontSize="xs"
                  color="green.400"
                  fontWeight="medium"
                  letterSpacing="wide"
                >
                  current
                </Text>
              )}
              {hobby && (
                <Text
                  fontSize="xs"
                  color="purple.400"
                  fontWeight="medium"
                  letterSpacing="wide"
                >
                  hobby
                </Text>
              )}
              {githubLink && (
                <Link
                  href={githubLink}
                  isExternal
                  color="whiteAlpha.400"
                  transition="color 0.2s"
                  _hover={{
                    color: 'whiteAlpha.800',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GithubIcon />
                </Link>
              )}
            </Flex>

            <Text mt={1.5} fontSize="sm" color="whiteAlpha.500" noOfLines={2}>
              {description}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default CodeCard;
