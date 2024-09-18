import { Drawer, DrawerProps } from "@mui/material";
import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";

type OpenDrawerProps = Omit<Partial<DrawerProps>, "content"> & {
  content: ReactNode;
};
type DrawerContextType = {
  openDrawer: (props: OpenDrawerProps) => void;
  closeDrawer: () => void;
};

const defaultValues = { openDrawer: () => {}, closeDrawer: () => {} };
const DrawerContext = createContext<DrawerContextType>(defaultValues);

// TODO - create unit tests
export const DrawerProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(undefined);
  const [drawerProps, setDrawerProps] = useState<Partial<DrawerProps>>({});

  // TODO - check mobile
  // TODO - transition props to clear after close?
  return (
    <DrawerContext.Provider value={{ closeDrawer, openDrawer }}>
      <Drawer open={isOpen} onClose={closeDrawer} {...drawerProps}>
        {content}
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );

  function openDrawer({ content, ...props }: OpenDrawerProps) {
    setContent(content);
    setDrawerProps(props);
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }
};

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};
