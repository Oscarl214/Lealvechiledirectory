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

  const menuItems = ['Home', 'uservehicles'];

  const handleSignOut = async () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="fixed z-5">
      {' '}
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className=" bg-transparent shadow-xl text-white"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/admin">
              <Image width={50} alt="NextUI hero Image" src="./favicon.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-white" href="/vehicleselection">
              Vehicle Selection
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/uservehicles" aria-current="page">
              Users Cars
            </Link>
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
          <NavbarItem>
            <Button
              onClick={() => handleSignOut()}
              color="primary"
              href="#"
              variant="flat"
              className="bg-transparent text-white"
            >
              Log Out
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className=" text-white bg-transparent">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              {item === 'Home' ? (
                <Link href="admin">
                  <div className="text-black">{item}</div>
                </Link>
              ) : (
                <Link
                  color={
                    index === 3
                      ? 'primary'
                      : index === menuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                  }
                  className="w-full text-black"
                  size="lg"
                  href={`${item}`}
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
