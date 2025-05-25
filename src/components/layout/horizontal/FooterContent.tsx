'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Hecho con amor `}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` por `}</span>
        <Link href='https://www.linkedin.com/in/yoel-ayan/' target='_blank' className='text-primary'>
          Yoel Ayan
        </Link>{' '}
        &
        <Link href='https://innova7e.com/' target='_blank' className='text-primary uppercase'>
          Innova7e
        </Link>
      </p>
      {!isBreakpointReached && <div className='flex items-center gap-4'></div>}
    </div>
  )
}

export default FooterContent
