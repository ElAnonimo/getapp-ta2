import { StylesConfig } from "react-select";
import { black } from "./cssVariables";

export const styles: StylesConfig = {
  control: (provided, _state) => ({
    ...provided,
    width: 250,
    fontSize: 16
  }),
  option: (provided, _state) => ({
    ...provided,
    fontSize: 14,
    color: black,
    textAlign: "start",
    backgroundColor: "transparent",
    "&:hover": {
      cursor: "pointer"
    }
  }),
  clearIndicator: (provided, _state) => ({
    ...provided,
    cursor: "pointer"
  }),
  noOptionsMessage: (provided, _state) => ({
    ...provided,
    fontSize: 16
  })
};
