import * as nodeFs from 'node:fs/promises';
import { pipe } from 'fp-ts/function';
import { isContainerDOMNode, isElementNode,
  type AttributeSpecType, type ContainerDOMNode, type IWindow } from './types';

export function setAttributes( elem: Element, attrs: AttributeSpecType ){
  for ( const attrName of Object.keys( attrs ) ){
    const attrValue = attrs[ attrName as keyof AttributeSpecType ];
    if(typeof attrValue === 'string') elem.setAttribute( attrName, attrValue );
  }
}

export function mapSiblings<T>(src: Node|null, cb:(src:Node)=>T):T[]{
  const result:T[] = [];
  let node:Node|null = src;
  while(node){
    result.push(cb(node));
    node = node.nextSibling;
  }
  return result;
}

export function clearChildren<T extends ContainerDOMNode>(src:T): T{
  const R = src.cloneNode() as T;
  while(R.firstChild) R.removeChild(R.firstChild);
  return R;
}

export function filterNode<T extends Node>(src: T, filter: (src:T)=>T): T{
  if(!isContainerDOMNode(src)) return filter(src.cloneNode() as T);
  const dst = filter(clearChildren(src));
  let child = src.firstChild;
  while(child){
    dst.appendChild(filterNode(child as any, filter));
    child = child.nextSibling;
  }
  return dst;
}

export function filterElements<T extends ContainerDOMNode>(src: T, filter:(src:T)=>T):T{
  return filterNode(src, (src:T)=>{
    if(isElementNode(src)) return filter(src);
    return src;
  });
}

export type NodeConverterFunctionType = (e:Node) => Node;

export function convertElement(elem: Element, cb: NodeConverterFunctionType):Element{
  return pipe(
    clearChildren(elem),
    (R) => {
      for(const c of elem.childNodes) R.appendChild(cb(c));
      return R;
    }
  );
}

export function xmldomFromString(window: IWindow, xmlString: string) : Document{
  return new window.DOMParser().parseFromString(xmlString, 'application/xml'); }

export async function xmldomFromFile(window:IWindow, filePath: string) : Promise<Document>{
  return pipe( await nodeFs.readFile(filePath, 'utf-8'), src => xmldomFromString( window, src ) ); }

export interface newDocumentOpt {
        namespaceURI? : string | null;
        qualifiedName?: string | null;
        documentElement?: Element;
        doctype?: DocumentType | null;
};

export function newDocument(window: IWindow, opt: Element | newDocumentOpt = {}){
  const opt_ = ( isElementNode(opt)? {documentElement: opt} : opt ) as newDocumentOpt;
  const R = window.document.implementation.createDocument(
    opt_.namespaceURI ?? null,
    opt_.qualifiedName ?? null,
    opt_.doctype ?? null);
  if(opt_.documentElement) R.appendChild(opt_.documentElement);
  return R;
}

export function serializeDom(window: IWindow, doc: Document): string{
  return new window.XMLSerializer().serializeToString(doc);
}

/* TODO
export function applyXslt(window: IWindow, xslDoc: Document, xmlDoc: Document): string {
    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    const resultDocument = xsltProcessor.transformToDocument(xmlDoc);
    const serializer = new window.XMLSerializer();
    return serializer.serializeToString(resultDocument);
}
 */
