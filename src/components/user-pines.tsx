'use client'

import Image from 'next/image'
import { ArrowBigUpIcon, ArrowUpRight, MoreVertical } from 'lucide-react'

import { Pin } from '@/types/pin'

import { DEFAULT_BLUR_DATA_URL, HREF_PREFIX } from '@/constants'
import { usePin } from '@/hooks/usePin'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { RemoveIc } from '@/components/icons'
import { SectionHeader } from '@/components/section-header'

type PinCardProps = {
  pin: Pin
  deletePin: ({ resourceId }: { resourceId: string }) => Promise<void>
  updatePinStatus: ({ id, action }: { id: string; action: 'add' | 'remove' }) => Promise<void>
}

const PinCard = ({ pin, deletePin, updatePinStatus }: PinCardProps) => {
  const { name, resourceId, url, summary, category, categoryColor, id, image, placeholder } = pin

  return (
    <article className='relative size-full overflow-hidden rounded-lg border border-light-600/70 dark:border-neutral-800/70 bg-light-600/20 hover:bg-light-600/70 dark:bg-[#101010] dark:hover:bg-[#191919] transition-colors duration-300 ease-in-out resource-item'>
      <div className='absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-orange-500/30 dark:via-orange-400/30 via-10% to-transparent' />
      <div className='flex flex-col gap-5 p-3'>
        <a
          className='flex flex-col gap-3'
          href={`${HREF_PREFIX}${url}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {image && (
            <div className='relative w-full h-[160px] rounded-md overflow-hidden border'>
              <Image
                src={image}
                fill
                alt={`Picture of ${name}`}
                className='object-cover'
                decoding='async'
                placeholder='blur'
                blurDataURL={placeholder ?? DEFAULT_BLUR_DATA_URL}
              />
            </div>
          )}
          <div className='flex flex-col gap-2'>
            <h2 className='text-base md:text-lg font-semibold text-balance'>{name}</h2>
            <span
              style={{
                // @ts-ignore
                '--text-color': categoryColor,
                '--border-color': categoryColor
              }}
              className='text-xs font-medium rounded-sm px-2 py-1 w-fit text-[var(--text-color)] border border-dashed border-[var(--border-color)]'
            >
              {category}
            </span>
            <p className='text-sm text-gray-700 dark:text-link line-clamp-4 text-pretty'>
              {summary}
            </p>
          </div>
        </a>
        <div className='flex justify-between'>
          <a
            className='group flex gap-1 items-center text-sm text-blue-700 dark:text-anchor transition-colors duration-300 ease-in-out resource-item hover:underline underline-offset-2'
            href={`${HREF_PREFIX}${url}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <span>Go to resource</span>
            <ArrowUpRight className='size-4 duration-200 group-hover:translate-x-[1.5px] group-hover:opacity-100' />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline' className='h-8 w-8'>
                <MoreVertical className='size-3.5' />
                <span className='sr-only'>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                className='group'
                onClick={() => updatePinStatus({ id, action: 'add' })}
              >
                <ArrowBigUpIcon className='size-[21px] mr-[7px] group-hover:-translate-y-[2.5px] transition-transform duration-300 ease-in-out' />
                <span>Add to Top</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='group'
                onClick={() => deletePin({ resourceId: resourceId as string })}
              >
                <RemoveIc className='size-4 ml-[3px] mr-[9px] overflow-visible' />
                <span>Remove pin</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}

function ListPines({ pines }: { pines: Pin[] }) {
  const { deletePin, updatePinStatus } = usePin()

  return (
    <div className='h-auto w-full shrink-0 rounded-md'>
      <SectionHeader
        title='Pinned Resources'
        description='Explore all the pins you have saved for quick access.'
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 gap-6 mt-6'>
        {pines.map((pin: Pin) => (
          <PinCard key={pin.id} pin={pin} deletePin={deletePin} updatePinStatus={updatePinStatus} />
        ))}
      </div>
    </div>
  )
}

export function UserPines({ userPines }: { userPines: Pin[] }) {
  return (
    <>
      {userPines.length > 0 ? (
        <ListPines pines={userPines} />
      ) : (
        <div className='grid-cols-3'>No pines found</div>
      )}
    </>
  )
}
