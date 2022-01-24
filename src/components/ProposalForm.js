import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Text,
  Box,
  Flex,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useForm, useFieldArray, useFormState } from "react-hook-form";

import { useAuth } from "../hooks/auth";
import Button from "./shared/Button";

const testContractAddress = "dev-1642959524227-28531923083634";

const defaultForm = {
  description: "Update greeting",
  actions: [
    {
      contract_name: testContractAddress,
      method_name: "setGreeting",
      args: JSON.stringify(
        {
          message: "proposal executed",
        },
        null,
        2
      ),
    },
    // {
    //   contract_name: "dev-1642959524227-28531923083634",
    //   method_name: "transfer",
    //   args: JSON.stringify(
    //     {
    //       to: "wallet.near",
    //       tokens: utils.format.parseNearAmount("0.01"),
    //     },
    //     null,
    //     2
    //   ),
    // },
  ],
};
function ProposalForm({ isLoading, onCreate }) {
  const { accountId } = useAuth();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultForm,
  });
  const { isDirty } = useFormState({ control });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "actions",
  });

  return (
    <form onSubmit={handleSubmit(onCreate)}>
      {!accountId ? (
        <Alert status="warning" mb={6}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Sign in required</AlertTitle>
            <AlertDescription display="block">
              You must sign in to create a proposal
            </AlertDescription>
          </Box>
        </Alert>
      ) : null}

      <FormControl isInvalid={!!errors.description} mb={4}>
        <FormLabel htmlFor="description">Describe the proposal</FormLabel>
        <Input
          {...register("description", {
            required: { value: true, message: "Description is required" },
            minLength: {
              value: 3,
              message: "Description must be >= 3 characters",
            },
            maxLength: {
              value: 60,
              message: "Description must be <= 60 characters",
            },
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      <Heading fontSize="xl" as="h4" mb={2}>
        Actions
      </Heading>
      <Text mb={4} color="gray.600">
        Define the actions to be executed if the proposal succeeds
      </Text>
      {fields.map((field, i) => {
        const error = (errors.actions && errors.actions[i]) || {};
        return (
          <Box key={field.id} pl={8} mb={8}>
            <Flex justify="space-between">
              <Heading fontSize="lg">{`${i + 1}.`}</Heading>
              <Button colorScheme="gray" onClick={() => remove(i)}>
                -
              </Button>
            </Flex>
            <FormControl isInvalid={!!error.contract_name} mb={2}>
              <FormLabel htmlFor="contract_name">Contract name</FormLabel>
              <Input
                {...register(`actions.${i}.contract_name`, {
                  required: {
                    value: true,
                    message: "Contract name is required",
                  },
                })}
              />
              <FormErrorMessage>
                {error.contract_name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!error.method_name} mb={2}>
              <FormLabel htmlFor="method_name">Method name</FormLabel>
              <Input
                {...register(`actions.${i}.method_name`, {
                  required: {
                    value: true,
                    message: "Method name is required",
                  },
                })}
                placeholder="transfer"
              />
              <FormErrorMessage>{error.method_name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!error.args} mb={2}>
              <FormLabel htmlFor="args">Args</FormLabel>
              <Textarea
                {...register(`actions.${i}.args`)}
                rows={5}
                fontSize="sm"
                fontFamily="mono"
                placeholder={JSON.stringify(
                  {
                    to: testContractAddress,
                    tokens: utils.format.parseNearAmount("1.5"),
                  },
                  null,
                  2
                )}
              />
              <FormErrorMessage>{error.args?.message}</FormErrorMessage>
            </FormControl>
          </Box>
        );
      })}
      <Button colorScheme="gray" onClick={() => append({})}>
        Add action
      </Button>

      <Flex justifyContent="flex-end">
        <Button type="submit" disabled={isLoading || !isValid || !accountId}>
          {isLoading ? <Spinner /> : "Create proposal"}
        </Button>
      </Flex>
    </form>
  );
}

export default ProposalForm;
