import React from 'react'
import ToggleMode from './ToggleMode'
import { Button } from './ui/button'
import Link from 'next/link'
import { BellIcon, HomeIcon, SearchIcon, UserIcon } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, UserButton } from '@clerk/nextjs'

async function DesktopNavbar() {
    const user = await currentUser();
    return (
        <div className='hidden md:flex items-center space-x-4'>
            <ToggleMode />

            <Button variant='ghost' className='flex items-center gap-2' asChild>
                <Link href='/'>
                    <HomeIcon className='h-4 w-4' />
                    <span className='hidden lg:inline'> Home </span>
                </Link>
            </Button>
            {user ? (<>
                <UserButton />
            </>) : (
                <SignInButton mode='modal'>
                    <Button variant='default'>
                        Sign In
                    </Button>
                </SignInButton>
            )
            }
        </div>
    )
}

export default DesktopNavbar