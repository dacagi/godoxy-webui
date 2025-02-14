"use client";

import Endpoints from "@/types/api/endpoints";
import { Icon } from "@/types/api/homepage";
import {
  Button,
  Group,
  HStack,
  Input,
  InputElement,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { MdError } from "react-icons/md";
import { useAsync } from "react-use";
import { FavIcon } from "../dashboard/favicon";
import { CloseButton } from "../ui/close-button";
import { EmptyState } from "../ui/empty-state";
import { Field } from "../ui/field";

export const IconSearcher: React.FC<
  {
    value: string;
    onChange: (v: string) => void;
  } & Omit<StackProps, "onChange" | "value">
> = ({ value, onChange, ...rest }) => {
  const icons = useAsync<() => Promise<Icon[]>>(
    () =>
      fetch(Endpoints.searchIcons(value, 10))
        .then((r) => r.json() as Promise<Icon[]>)
        .then((r) =>
          r.toSorted(
            // @ts-ignore
            (a, b) => b.includes(oppositeTheme) - a.includes(oppositeTheme),
          ),
        ),
    [value],
  );

  const { resolvedTheme } = useTheme();
  const oppositeTheme = resolvedTheme === "light" ? "dark" : "light";
  const [focused, setFocused] = useState(false);

  return (
    <Stack gap={focused ? 1 : 0} w="full" {...rest}>
      <Field label="Icon" borderBottomRadius={"none"}>
        <Group w="full">
          <Input
            placeholder="Start typing to fuzzy search an icon, or paste a URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            variant={"subtle"}
          />
          <InputElement placement="end">
            <CloseButton variant={"plain"} onClick={() => onChange("")} />
          </InputElement>
        </Group>
      </Field>
      <Stack
        overflow={"scroll"}
        maxH="250px"
        w={"full"}
        px="3"
        roundedBottom={"md"}
        bg="var(--input-bg)"
      >
        {icons.error ? (
          <EmptyState
            icon={<MdError />}
            title={"Error loading icons"}
            description={icons.error.message}
          />
        ) : !icons.value || icons.value.length === 0 ? (
          <EmptyState title={"No result"} />
        ) : (
          icons.value.map((e) => (
            <Button
              bg="inherit"
              p="0"
              key={e}
              asChild
              onClick={() => onChange(e)}
            >
              <HStack
                color="fg.info"
                gap="2"
                textAlign={"left"}
                justify={"left"}
              >
                <FavIcon url={e} size="28px" />
                <Text>{e}</Text>
              </HStack>
            </Button>
          ))
        )}
      </Stack>
    </Stack>
  );
};
