import {useTranslations} from 'next-intl';
import AcmeLogo from '@/app/ui/acme-logo';
// import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  const t = useTranslations('HomePage');
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* <div className={styles.shape} /> */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-green-50 p-4 md:h-22">
        <AcmeLogo />        
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-green-50 px-6 py-10 md:w-2/5 md:px-20">        
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>{t('title')}</strong> 
          </p>
         
            <div className="flex flex-col space-y-4">
              <button className="bg-green-500 text-white px-1 py-2 rounded">{t('login_as_labor')}</button>
              <button className="bg-green-500 text-white px-1 py-2 rounded">{t('login_as_farmer')}</button>              
            </div>            
         
        </div>
        <div className="hidden md:flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
            <Image
              src="/farmer.webp"
              width={1000}
              height={760}
              className="hidden md:block"
              alt="Screenshots of the dashboard project showing desktop version"
            />            
        </div>
      </div>
    </main>
  );
}
