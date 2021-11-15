export const transformResult = async (result) => {
  await result;
  if (result.password) {
    delete result.password;
  }

  console.log({ result });
  return result;
};
