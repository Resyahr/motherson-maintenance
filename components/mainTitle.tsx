import { ReactNode } from "react";
const MainTitle = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
      {children}
    </h1>
  );
};

export default MainTitle;
