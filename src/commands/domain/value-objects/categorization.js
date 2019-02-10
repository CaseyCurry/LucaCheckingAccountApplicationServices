import deepFreeze from "deep-freeze";

// TODO: unit test
const Categorization = ({ category, subcategory }) => {
  return deepFreeze({ category, subcategory });
};

export { Categorization };
