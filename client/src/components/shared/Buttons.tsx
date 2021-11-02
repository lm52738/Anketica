import { Button, ButtonProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const PrimaryButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button {...rest} color="white" bg="primary-60" minW="full">
      {children}
    </Button>
  );
};

export const SecondaryButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button {...rest} variant="outline" minW="full">
      {children}
    </Button>
  );
};
