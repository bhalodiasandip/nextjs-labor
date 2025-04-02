'use client';

import clsx from 'clsx';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import {useTransition} from 'react';
import {Locale} from '@/i18n/config';
import {setUserLocale} from '@/services/locale';
import {useTranslations} from 'next-intl';
import { Dropdown, DropdownItem, Badge } from "flowbite-react";

export default function LocaleSwitcherSelect() {
  const t = useTranslations('Global');  
  const [isPending, startTransition] = useTransition();

  function changeLocale(value: string) {    
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="fixed shadow-xl shadow-gray-500/50 right-2 bottom-2 md:right-5 md:bottom-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
        <Dropdown label="" placement="top" renderTrigger={() => <span>
          <GlobeAltIcon className="h-8 w-8" />
        </span>}>
          <DropdownItem onClick={() => changeLocale("gu")}>{t('gujarati')}</DropdownItem>
          <DropdownItem onClick={() => changeLocale("en")}>{t('english')}</DropdownItem>        
        </Dropdown>                    
    </div>
  );
}
