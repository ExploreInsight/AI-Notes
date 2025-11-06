'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { HomeIcon, LogOutIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs';


const MobileNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex md:hidden items-center space-x-2'>
      <Button  variant='ghost'
        size='icon'
        className="mr-2">
            <SearchIcon className='h-[1.2rem] w-[1.2rem' />
      </Button>
      {/* Theme Toggle */}
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Mobile Menu */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MenuIcon className='h-6 w-6' />
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px]'>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className='flex flex-col space-y-4 mt-6'>
            {/* Home */}
            <Button variant='ghost' className='flex items-center gap-3 justify-start' asChild onClick={()=> setShowMobileMenu(false)}>
              <Link href='/'>
                <HomeIcon className='w-4 h-4' />
                Home
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                {/* Logout */}
                <SignOutButton>
                  <Button variant="ghost" onClick={()=> setShowMobileMenu(false)} className="flex items-center gap-3 justify-start w-full">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              // Sign In
              <SignInButton mode='modal'>
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavbar;