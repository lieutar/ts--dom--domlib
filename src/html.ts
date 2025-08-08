import * as nodePath from 'node:path';
import type { ContainerDOMNode, ElementSpecType } from "./types";
import { filterElements } from "./utils";

export function cssLinks(... urls : string[]) : ElementSpecType[] {
  return urls.map(url => ['link', {rel: 'stylesheet', type: 'text/css', href: url}]);
}

const imageTypes : {[key:string]: string} = {
  svg: "image/svg+xml",
  ico: "image/x-icon"
}

export type IConSpecType = (string| [string, string]);
export function iconLinks(... iconSpecs: IConSpecType[]) : ElementSpecType[] {
  return iconSpecs.map(spec => {
    const [type, href] = (()=>{
      if(Array.isArray(spec)) return [spec[0]!, spec[1]!];
      const match = spec.match(/\.([^\.]+)$/);
      if(match){
        const suffix = match[1]!;
        const type = imageTypes[suffix];
        if(type) return [type, spec];
      }
      throw new TypeError(`${spec}`);
    })();
    return ['link',{rel: 'icon', type, href}] as ElementSpecType;
  });
}

export function htmlHead(
  params: {title: string, charset?: string, css?: string[], icons?: IConSpecType[]}
) : ElementSpecType{
  const title   = params.title;
  const charset = params.charset ?? 'UTF-8';
  const css     = params.css ?? [];
  const icons   = params.icons ?? [];
  return [ 'head',
    ['meta',{charset}],
    ['title', title ],
    ... cssLinks(... css),
    ... iconLinks(... icons)];
}

export const HtmlLinkAttributes: {[_:string]:string[]} = {
  a:      ['href'],
  link:   ['href'],
  script: ['src'],
  img:    ['src'],
  iframe: ['src'],
  form:   ['action'],
};

export function filterHtmlLinks<T extends ContainerDOMNode>(
  src: T, filter: (src:string, element: Element, attribute: string)=>string):T
{
  return filterElements(src as any, (src:Element)=>{
    const attrs = HtmlLinkAttributes[src.tagName.toLowerCase()];
    if(!attrs) return src;
    const dst = src.cloneNode() as Element;
    for(const attr of attrs){
      const value = src.getAttribute(attr);
      if(value) dst.setAttribute(attr, filter(value, src, attr));
    }
    return dst;
  }) as T;
}

export function makeHtmlLinksRelative<T extends ContainerDOMNode>(
  src: T, baseUrl: string):T
{
  return filterHtmlLinks(src, (src: string):string=>{
    if(src.match(/^\//)) return nodePath.relative(baseUrl, src);
    return src;
  });
}
