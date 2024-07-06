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

import logOut from '../firebase/auth/logout';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ['Logout', 'Profile', 'Car Selection'];

  return (
    <div>
      {' '}
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className=" bg-black shadow-xl text-white"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Image width={50} alt="NextUI hero Image" src="./favicon.png" />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-white" href="/admin">
              Vehicle Selection
            </Link>
          </NavbarItem>
          {/* <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Customers
            </Link>
          </NavbarItem>
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
              onClick={logOut}
              color="primary"
              href="#"
              variant="flat"
              className="bg-transparent text-white"
            >
              Log Out
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className=" opacity-55 text-white bg-gray-800">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              {item === 'Logout' ? (
                <Link href="/">
                  <div className="text-white" onClick={logOut}>
                    {item}
                  </div>
                </Link>
              ) : (
                <Link
                  color={
                    index === 2
                      ? 'primary'
                      : index === menuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                  }
                  className="w-full text-white"
                  href="#"
                  size="lg"
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
