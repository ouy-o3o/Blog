import React, { FC, use } from "react";

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    message: "Hello, About!",
  };
}

const Index: FC = () => {
  const { message } = use(getData());
  return <h1>{message}</h1>;
};
export default Index;
