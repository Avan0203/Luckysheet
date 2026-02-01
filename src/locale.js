import en from 'public/locale/en'
import zh from 'public/locale/zh'
import es from 'public/locale/es'
import zh_tw from 'public/locale/zh_tw'
import Store from './store';

export const locales = {en,zh,es,zh_tw}

function locale(){
    return locales[Store.lang];
}

export default locale;