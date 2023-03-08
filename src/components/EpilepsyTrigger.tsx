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

type EpilepsyTriggerProps = {
  title: string;
  location: string;
  hoverEffect: number;
};

const EpilepsyTrigger = ({
  title,
  location,
  hoverEffect,
}: EpilepsyTriggerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        className={`hover-effect-${hoverEffect}`}
        p={4}
        cursor="pointer"
        onClick={onOpen}
      >
        {title}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color="#3ee587" fontSize={24}>
              🚨 EPILEPSY WARNING 🚨
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
              className="hover-effect-5"
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
