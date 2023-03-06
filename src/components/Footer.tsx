import type { ComponentWithAs, IconProps } from '@chakra-ui/react';
import { HStack, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

import { GithubIcon } from '@/components/icons/GithubIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';

type IconLinkType = {
  Icon: ComponentWithAs<'svg', IconProps>;
  href: string;
  external: boolean;
};

const iconLinks: IconLinkType[] = [
  {
    Icon: TwitterIcon,
    href: 'https://twitter.com/viiiiiiiiiiiid',
    external: true,
  },
  {
    Icon: GithubIcon,
    href: 'https://github.com/vidvidvid',
    external: true,
  },
];

const IconLink = ({ Icon, href, external }: IconLinkType) =>
  external ? (
    <ChakraLink href={href} color="white" _hover={{ color: 'main' }} isExternal>
      <Icon />
    </ChakraLink>
  ) : (
    <NextLink href={href} passHref>
      <ChakraLink color="white" _hover={{ color: 'main' }}>
        <Icon />
      </ChakraLink>
    </NextLink>
  );

export const Footer: React.FC = () => (
  <VStack
    w="100%"
    justify="center"
    align="center"
    position="fixed"
    bottom={0}
    zIndex={1000}
    gap={2}
    pt={8}
    pb={4}
    fontSize="sm"
    background="linear-gradient(transparent, rgba(255, 255, 255, 0.1))"
    h={{ base: '16rem', md: '10rem' }}
  >
    <HStack gap={4} fontSize="xl">
      {iconLinks.map((l) => (
        <IconLink key={l.href} {...l} />
      ))}
    </HStack>
    <Text>2023 © vid</Text>
  </VStack>
);
