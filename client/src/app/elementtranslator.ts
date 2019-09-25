import { nooccurrence } from './global.data';

export function translateelement(element: HTMLElement | SVGElement, translationkey: string, translationvalue: string) {
    let newtransform = `${translationkey}(${translationvalue})`

    if(element.style.transform.indexOf(translationkey) !== nooccurrence) {
      let anyvalueregex = new RegExp(`${translationkey}\\(.+\\)`) //any translationvalue one or more times
      let replacement = element.style.transform.replace(anyvalueregex, newtransform)  
      element.style.transform = replacement
    }

    else {
      element.style.transform += newtransform
    }    
}