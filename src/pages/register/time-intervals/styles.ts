import { Box, styled, Text } from "@aim-ignite-ui/react";

export const IntervalBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
});

export const IntervalContainer = styled("div", {
  border: "1px solid $gray600",
  borderRadius: "$md",
  marginBottom: "$4",
});

export const IntervalItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$3 $4",

  "& + &": {
    //aplica só apartir do 2 item, bom para tabelas
    borderTop: "1px solid $gray600",
  },
});

export const IntervalDay = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

export const IntervalInputs = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",

  "input::-webkit-calendar-picker-indicator": {
    filter: "invert(100%) brightness(60%)",
  },

  div: {
    height: "38px",
  },
});

export const FormError = styled(Text, {
  color: "#f75a68",
  marginBottom: "$4",
});
