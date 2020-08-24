import * as React from "react";

export const useRequiredContext = <C>(context: React.Context<C>, errorMsg?: string): NonNullable<C> => {
  const result = React.useContext(context);
  if (result == null) {
    throw new Error(errorMsg || "Required context missing!");
  }
  return result as NonNullable<C>; // why is this cast needed
};