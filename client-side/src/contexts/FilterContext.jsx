// contexts/FilterContext.js
import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState("all");

  return (
    <FilterContext.Provider
      value={{ searchTerm, setSearchTerm, filters, setFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
