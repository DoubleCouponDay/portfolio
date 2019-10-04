import { nooccurrence } from './global.data';

export function transformelement(element: HTMLElement | SVGElement, transformkey: string, transformvalue: string) {
    let newtransform = `${transformkey}(${transformvalue})`

    if(element.style.transform.indexOf(transformkey) !== nooccurrence) {
      let anyvalueregex = new RegExp(`${transformkey}\\(.+\\)`) //any translationvalue one or more times
      let replacement = element.style.transform.replace(anyvalueregex, newtransform)  
      element.style.transform = replacement
    }

    else {
      element.style.transform += newtransform
    }    
}

export function applytransformtoeachnode(nodes: NodeListOf<SVGElement | HTMLElement>, transformkey: string, transformvalue: string) {
  
  nodes.forEach((value, index) => {
    transformelement(value, transformkey, transformvalue)
  })
}