'use client';
import React, { useState } from 'react';
import SearchManufacturer from './SearchManufacturer';

const SearchBar = () => {
  const [manufacturer, setManuFacturer] = useState();
  const handleSearch = () => {};
  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="text-black text-center">Select A Car</div>
      <SearchManufacturer
        manufacturer={manufacturer}
        setManuFacturer={setManuFacturer}
      />
    </form>
  );
};

export default SearchBar;
