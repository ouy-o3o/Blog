import React, { FC } from "react";

interface Props {}
const Index: FC<Props> = () => {
  return (
    <div className="h-60 flex-1 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
      Hello, Analytics Page Views!
    </div>
  );
};
export default Index;
