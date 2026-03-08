import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

import { hoverState } from '@/components/3js/Crazy';

type EpilepsyTriggerProps = {
  title: string;
  location: string;
  stripColor: string;
};

const EpilepsyTrigger = ({
  title,
  location,
  stripColor,
}: EpilepsyTriggerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Box
        position="relative"
        cursor="pointer"
        onClick={onOpen}
        onMouseEnter={() => {
          hoverState.mode = 'imagery';
          setHovered(true);
        }}
        onMouseLeave={() => {
          hoverState.mode = null;
          setHovered(false);
        }}
      >
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left="50%"
          width="100vw"
          bg={hovered ? 'var(--strip-bg, #333)' : stripColor}
          opacity={0.85}
          zIndex={-1}
          transform="translateX(-50%)"
          cursor="pointer"
        />
        <Box
          p={1}
          style={{ color: hovered ? 'var(--label-color, white)' : 'black' }}
        >
          {title}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color="#3ee587" fontSize={24}>
              EPILEPSY WARNING
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={20}>
            Flashing stuff incoming. If you have epilepsy, please{' '}
            <Text
              display="inline-flex"
              color="#ff11a6"
              fontSize={30}
              textDecoration="underline"
            >
              do not
            </Text>{' '}
            click
            <Button
              p={4}
              mt={-2}
              color="#76eaff"
              ml={1}
              fontSize={30}
              variant="ghost"
              onClick={() => {
                window.location.href = `/${location}`;
              }}
            >
              here
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EpilepsyTrigger;
