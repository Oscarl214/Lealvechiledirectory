'use client';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Image,
} from '@nextui-org/react';

import { signOut } from 'next-auth/react';
import Router from 'next/router';
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ['Home', 'profile', 'vehicleselection', 'Logout'];

  const handleSignOut = async () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="fixed z-50 w-full">
      {' '}
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className=" bg-black shadow-xl text-white "
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/admin">
              <Image width={50} alt="Car Image" src="./favicon.png" />
            </Link>
          </NavbarBrand>
          <NavbarItem>
            <Link href="/profile" aria-current="page">
              My Vehicle
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-white" href="/vehicleselection">
              Vehicle Selection
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            {/* <Link href="/profile" aria-current="page">
              My Vehicle
            </Link> */}
          </NavbarItem>
          {/* 
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem> */}
        </NavbarContent>
        <NavbarContent justify="end">
          {/* <NavbarItem className="hidden lg:flex">
        <Link href="#">Login</Link>
      </NavbarItem> */}
          {/* <NavbarItem>
            <Link href="/profile" aria-current="page">
              My Vehicle
            </Link>
          </NavbarItem> */}
        </NavbarContent>
        <NavbarMenu className="text-white bg-black flex justify-center items-center">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              {item === 'Home' ? (
                <Link href="/admin">
                  <div className="text-white">{item}</div>
                </Link>
              ) : item === 'Logout' ? (
                <div
                  className=" text-white cursor-pointer"
                  onClick={handleSignOut}
                >
                  {item}
                </div>
              ) : (
                <Link
                  href={`${item}`}
                  className={`w-full text-white ${
                    index === 3
                      ? 'text-primary'
                      : index === menuItems.length - 1
                      ? 'text-danger'
                      : ''
                  }`}
                >
                  {item}
                </Link>
              )}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
};

export default NavBar;
