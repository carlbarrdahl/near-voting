import React from "react";
import * as Chakra from "@chakra-ui/react";

export default function Badge({ color = "purple", ...props }) {
  return (
    <Chakra.Badge
      colorScheme={color}
      color={color}
      size="2xl"
      py={1}
      px={2}
      {...props}
    ></Chakra.Badge>
  );
}
