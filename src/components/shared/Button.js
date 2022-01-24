import React from "react";
import * as Chakra from "@chakra-ui/react";

export default function Button({ ...props }) {
  return <Chakra.Button colorScheme="purple" borderRadius={2} {...props} />;
}
