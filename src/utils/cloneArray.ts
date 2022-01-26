const cloneArray = (arr: any[]) => {
  return arr.map((a) => {
    return {...a};
  });
};

export default cloneArray;
