'use client'

// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import LoginForm from '@auth/components/LoginForm'

// Config Imports
import themeConfig from '@configs/themeConfig'

const LoginV2 = () => {
  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Bienvenido a ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>
              Por favor, inicia sesión para continuar.
            </Typography>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginV2
