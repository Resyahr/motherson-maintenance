"use client";
import { createContext, useContext } from "react";
import { useState, ReactNode } from "react";

interface IToggleMenuContext {
  children: ReactNode;
}

type ToggleMenuContextType = {
  isMenuOpen: boolean;
  handleToggleMenu: () => void;
};

const defaultContextValue: ToggleMenuContextType = {
  isMenuOpen: true,
  handleToggleMenu: () => {},
};

export const ToggleMenuContext =
  createContext<ToggleMenuContextType>(defaultContextValue);

const ToggleMenuProvider = ({ children }: IToggleMenuContext) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <ToggleMenuContext.Provider
      children={children}
      value={{ isMenuOpen, handleToggleMenu }}
    />
  );
};

export const useToggleMenu = () => {
  const context = useContext(ToggleMenuContext);
  if (!context) {
    throw new Error("Menu toggler must be in a context");
  }

  return context;
};

export default ToggleMenuProvider;
