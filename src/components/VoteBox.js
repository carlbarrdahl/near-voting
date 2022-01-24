import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  Input,
  Radio,
  RadioGroup,
  useRadio,
  useRadioGroup,
  Spinner,
} from "@chakra-ui/react";

import Button from "./shared/Button";
import { useCastVote } from "../hooks/proposals";
import { useAuth } from "../hooks/auth";

function VoteChoice(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} disabled={props.disabled} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius={2}
        fontWeight="bold"
        color="gray.700"
        mb={2}
        _hover={{
          cursor: props.disabled ? "not-allowed" : "pointer",
          borderColor: props.disabled ? "" : "green.200",
        }}
        _checked={{ borderColor: "green.400" }}
        px={5}
        py={3}
      >
        <Flex justifyContent="space-between">
          {props.children}
          <Radio
            {...input}
            style={{}}
            colorScheme="green"
            isChecked={true}
            checked
          />
        </Flex>
      </Box>
    </Box>
  );
}

function VoteBox({ proposalId, votes = [] }) {
  const { accountId } = useAuth();
  const options = ["For", "Against"];
  const [support, setSupport] = useState();
  const [reason, setReason] = useState("");

  const { mutateAsync: castVote, isLoading } = useCastVote();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "vote",
    onChange: setSupport,
  });
  const group = getRootProps();

  function handleVote(e) {
    e.preventDefault();
    console.log("Voting...", support, reason);
    castVote({ proposalId, support: support === "For" ? 1 : 0, reason }).then(
      (vote) => {
        setSupport("");
        setReason("");
      }
    );
  }
  const hasVoted = votes.some((v) => v.voter === accountId);

  const voteDisabled = !accountId || hasVoted;
  return (
    <Box
      as="form"
      onSubmit={handleVote}
      style={{ opacity: voteDisabled ? 0.5 : 1 }}
      mb={6}
    >
      <RadioGroup {...group} value={support} mb={4}>
        {options.map((value) => (
          <VoteChoice
            key={value}
            disabled={isLoading || voteDisabled}
            {...getRadioProps({ value })}
          >
            {value}
          </VoteChoice>
        ))}
      </RadioGroup>
      <Text fontWeight="bold" mb={2}>
        Add comment
      </Text>
      <Input
        mb={4}
        placeholder="What are your thoughts?"
        value={reason}
        disabled={!support || isLoading}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button
        type="submit"
        isFullWidth
        onClick={handleVote}
        disabled={!support || isLoading || voteDisabled}
      >
        {isLoading ? (
          <Spinner />
        ) : !accountId ? (
          "You must sign in to vote"
        ) : hasVoted ? (
          "You have already voted"
        ) : (
          "Vote"
        )}
      </Button>
    </Box>
  );
}

export default VoteBox;
