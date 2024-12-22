"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"



export function ThemeProvider({ children, ...props }) {

  const [mounted, setmounted] = React.useState(false)

  React.useEffect(() => {
    setmounted(true);
  },[])

  if (!mounted) {
    return null;
  }
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
