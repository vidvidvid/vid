import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useState } from 'react';

import StripButton from '@/components/StripButton';

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <StripButton
        label={title}
        mode="imagery"
        stripColor={stripColor}
        onClick={() => setOpen(true)}
      />

      <Dialog.Root
        open={open}
        onOpenChange={(details: { open: boolean }) => setOpen(details.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title color="#3ee587" fontSize={24}>
                  EPILEPSY WARNING
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body fontSize={20}>
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
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default EpilepsyTrigger;
