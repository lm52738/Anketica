import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import React, { FC } from "react";

export const PrimaryButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      {...rest}
      color="white"
      bg="primary-60"
      minW="full"
      _loading={{
        color: "primary-100",
        opacity: 0.6,
      }}
      spinner={<Spinner color="primary-100" />}
    >
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
