// React Imports
import { useState } from 'react'

const useTab = (initialTab: string) => {
  const [currentTab, setCurrentTab] = useState(initialTab)

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  return {
    currentTab,
    handleTabChange
  }
}

export default useTab
