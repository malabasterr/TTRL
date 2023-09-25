// Dropdown.js

import React from 'react';

function Dropdown({ placeholder, options, selected, onChange }) {
  return (
    <select value={selected} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
