import React, { useEffect, useState } from 'react'

import _announcement from './data/Announcement.json'
import { IconX } from 'ui'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

export interface AnnouncementProps {
  show: boolean
  text: string
  launchDate: string
  link: string
  badge?: string
}

const announcement = _announcement as AnnouncementProps

interface AnnouncementComponentProps {
  show?: boolean
  className?: string
}

const Announcement = ({
  show = true,
  className,
  children,
}: PropsWithChildren<AnnouncementComponentProps>) => {
  const [hidden, setHidden] = useState(true)

  const router = useRouter()
  const isLaunchWeekSection = router.pathname.includes('launch-week')

  // override to hide announcement
  if (!show || !announcement.show) return null

  // construct the key for the announcement, based on the title text
  const announcementKey = 'announcement_' + announcement.text.replace(/ /g, '')

  // window.localStorage is kept inside useEffect
  // to prevent error
  useEffect(function () {
    if (!window.localStorage.getItem(announcementKey)) {
      return setHidden(false)
    }
  }, [])

  function handleClose(event: any) {
    event.stopPropagation()

    window.localStorage.setItem(announcementKey, 'hidden')
    return setHidden(true)
  }

  function handleLink() {
    router.push(announcement.link)
  }

  // Always show if on LW section
  if (!isLaunchWeekSection && hidden) {
    return null
  } else {
    return (
      <div onClick={handleLink} className={['relative w-full cursor-pointer', className].join(' ')}>
        {!isLaunchWeekSection && (
          <div
            className="absolute right-4 flex h-full items-center opacity-50 transition-opacity hover:opacity-100"
            onClick={handleClose}
          >
            <IconX size={16} />
          </div>
        )}
        {children}
      </div>
    )
  }
}

export default Announcement
