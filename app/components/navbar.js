'use client'
import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import  {useAuthContext} from '../context/AuthContext'

import logOut from '../firebase/auth/logout';

const NavBar = () => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogOut = async (event) => {
        event.preventDefault();
    
        const { result, error } = await logOut();
    
        if (error) {
          return console.log('Error logging user out', error);
        }
        console.log(result);
        return Router.push('/');
      };

    const menuItems = [
      "Profile",
      "Dashboard",
      "Log Out",
    ];

  return (
    <div>   <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-trasnparent font-popping">
    <NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
   
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
    </NavbarContent>

    {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <NavbarItem>
        <Link color="foreground" href="#">
          Features
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link href="#" aria-current="page">
          Customers
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Integrations
        </Link>
      </NavbarItem>
    </NavbarContent> */}
    <NavbarContent justify="end">
      {/* <NavbarItem className="hidden lg:flex">
        <Link href="#">Login</Link>
      </NavbarItem> */}
      <NavbarItem>
          
        <Button onClick={handleLogOut} color="primary" href="#" variant="flat">
          Log Out
        </Button>
      </NavbarItem>
    </NavbarContent>
    <NavbarMenu>
      {menuItems.map((item, index) => (
        <NavbarMenuItem key={`${item}-${index}`}>
          <Link
            color={
              index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
            }
            className="w-full"
            href="#"
            size="lg"
          >
            {item}
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  </Navbar></div>
  )
}

export default NavBar






