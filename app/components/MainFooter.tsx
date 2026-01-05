import Link from 'next/link'
import React from 'react'

const MainFooter = () => {
  return (
    <footer className='flex items-center justify-between p-5'>
        <header>
            <h2>Prysmor</h2>
            <p>Break ideas into brilliance.</p>
        </header>
        <nav>
            <Link href="/about">about</Link>
        </nav>
    </footer>
  )
}

export default MainFooter