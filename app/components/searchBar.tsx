'use client';
import React, { useState } from 'react';
import SearchManufacturer from './SearchManufacturer';

const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState();
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="text-black text-center">Select A Car</div>
      <SearchManufacturer
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
      />
    </form>
  );
};

export default SearchBar;
