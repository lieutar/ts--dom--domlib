//import * as SaxonJs from 'saxon-js';
//import {Xslt, XmlParser} from 'xslt-processor';

import type { ElementSpecType, FragmentSpecType, IWindow } from './types';
//import { readFile } from '@looper-utils/fs';
//import { newDocument, serializeDom, xmldomFromString } from './utils';
import { asDocument } from './dsl';


/*///
type ProcessXsltParams = { window: IWindow } &
({xsltFile: string} | {xsltString: string} | {xslt: Document}) &
({srcFile: string}  | {srcString: string}  | {src: Document});
export function processXslt(params: ProcessXsltParams & { asText: true }):Promise<string>;
export function processXslt(params: ProcessXsltParams & { asText?: false }):Promise<Document>;
export async function processXslt(params:ProcessXsltParams & {asText?: boolean}):Promise<Document|string>{
  const window = params.window;
  const xmlParser = new XmlParser();
  const getDom = async( prefix:string )=>{
    const xml = await ( async()=>{
      const p = params as any;
      const string = prefix + 'String';
      if(p[string]) return p[string];
      const file   = prefix + 'File';
      if(p[file]) return await readFile(p[file]);
      if(p[prefix]) return serializeDom(window, p[prefix]);
      throw new Error();
    })();
    //console.log(prefix, ":\n", xml, "\n");
    return xmlParser.xmlParse(xml);
  };
  const src        = await getDom('src');
  const stylesheet = await getDom('xslt');
  const xslt = new Xslt();
  const result = await xslt.xsltProcess(src, stylesheet);
  if(params.asText) return result;
  return xmldomFromString(window, result);
}

// export function processXslt(params: ProcessXsltParams & { asText: true }):Promise<string>;
// export function processXslt(params: ProcessXsltParams & { asText?: false }):Promise<Document>;
// export async function processXslt(params:ProcessXsltParams & {asText?: boolean}):Promise<Document|string>{
//   const window = params.window;
//   const getDom = async(prefix:string)=>{
//     const p = params as any;
//     if(p[prefix]) return p[prefix] as Document;
//     const xml =  await (async ()=>{
//       const string = prefix + 'String';
//       if(p[string]) return p[string];
//       const file   = prefix + 'File';
//       if(p[file]) return await readFile(p[file]);
//       throw new Error();
//     })() as string;
//     return xmldomFromString(window, xml);
//   };
//   const sourceNode = await getDom('src');
//   const stylesheetNode = await getDom('xslt');
//   const stylesheetText = serializeDom(window, stylesheetNode);
//   console.log(stylesheetText);
//   const destination = params.asText ? 'serialized' : 'document';
//   const rs = await SaxonJs.transform({ sourceNode, stylesheetText, destination}, 'async');
//   return rs.principalResult;
// }


// /*///
// import { DOMImplementationImpl, DOMParserImpl, XMLSerializerImpl } from 'xmldom-ts';
// import { install, XSLTProcessor } from 'xslt-ts';

// type ProcessXsltParams = { window: IWindow } &
// ({xsltFile: string} | {xsltString: string} | {xslt: Document}) &
// ({srcFile: string}  | {srcString: string}  | {src: Document});
// export function processXslt(params: ProcessXsltParams & { asText: true }):Promise<string>;
// export function processXslt(params: ProcessXsltParams & { asText?: false }):Promise<Document>;
// export async function processXslt(params: ProcessXsltParams & { asText?: boolean }):Promise<Document|string>{
//   const window = params.window;
//   const xmlParser = new DOMParserImpl();
//   install(
//     xmlParser,
//     new XMLSerializerImpl(),
//     new DOMImplementationImpl());
//   const processor = new XSLTProcessor();
//   const getDom = async( prefix:string )=>{
//     const xml = await ( async()=>{
//       const p = params as any;
//       const string = prefix + 'String';
//       if(p[string]) return p[string];
//       const file   = prefix + 'File';
//       if(p[file]) return await readFile(p[file]);
//       if(p[prefix]) return serializeDom(window, p[prefix]);
//       throw new Error();
//     })();
//     //console.log(prefix, ":\n", xml, "\n");
//     return xmlParser.parseFromString(xml);
//   };

//   // const getDom = async(prefix:string)=>{
//   //   const p = params as any;
//   //   if(p[prefix]) return p[prefix] as Document;
//   //   const xml =  await (async ()=>{
//   //     const string = prefix + 'String';
//   //     if(p[string]) return p[string];
//   //     const file   = prefix + 'File';
//   //     if(p[file]) return await readFile(p[file]);
//   //     throw new Error();
//   //   })() as string;
//   //   return xmldomFromString(window, xml);
//   // };

//   const src  = await getDom('src');
//   const xslt = await getDom('xslt');
//   processor.importStylesheet(xslt);
//   const doc = newDocument(window);
//   const frgm = processor.transformToFragment(src, doc);
//   if(!params.asText){
//     while(doc.firstChild) doc.removeChild(doc.firstChild);
//     doc.appendChild(frgm);
//     return doc;
//   }else{
//     const buf = [];
//     let node = frgm.firstChild;
//     while(node){
//       buf.push(node.textContent);
//       node = node.nextSibling;
//     }
//     return buf.join('');
//   }
// }
//   //*///

export const xsl = (()=>{
  const stylesheet = (... body: FragmentSpecType):ElementSpecType =>
    ['xsl:stylesheet', {version:"1.0", 'xmlns:xsl':"http://www.w3.org/1999/XSL/Transform"},...body];
  const xsl = (window: IWindow, ... body: FragmentSpecType) => asDocument(window,stylesheet(...body));
  xsl.stylesheet = stylesheet;
  xsl.output = (method:string):ElementSpecType => ['xsl:output', {method}];

  xsl.def = (name:string, params:string[], ... body:FragmentSpecType):ElementSpecType =>
    ['xsl:template', {name},
      ... params.map(name => ['xsl:param', {name}]) as FragmentSpecType,
      ... body];

  xsl.call = (name:string, withParam: {[name:string]:string} = {}):ElementSpecType => ['xsl:call-template', {name},
    ... Object.entries(withParam).map(([name, select])=>['xsl:with-param', {name, select}]) as FragmentSpecType];

  xsl.choose = (conditions: {[test:string]: FragmentSpecType}, otherwise?: FragmentSpecType)=> ['xsl:choose',
    ... Object.entries(conditions).map(([test, body])=>['xsl:when', {test}, ... body]),
    ... (otherwise ? [['xsl:otherwise', ... otherwise]] : [])];

  xsl.if = (test: string, ...body: FragmentSpecType):ElementSpecType => ['xsl:if', { test }, ...body];

  xsl.match = (match:string, ... body:FragmentSpecType):ElementSpecType => ['xsl:template', {match}, ... body];
  xsl.matchApply = (match:string):ElementSpecType => xsl.match(match, xsl.apply());
  xsl.applyWhere = (... matches:string[]):FragmentSpecType => matches.map(xsl.matchApply);
  xsl.apply = ():ElementSpecType => ['xsl:apply-templates'];
  xsl.valueOf = (select: string = "."):ElementSpecType => ['xsl:value-of', {select}];
  xsl.matchValueOf = (match:string, select:string = ".") => xsl.match(match, xsl.valueOf(select));

  xsl.forEach = (select:string, ... body:FragmentSpecType):ElementSpecType => ['xsl:for-each', {select}, ... body];
  xsl.var = (name:string, select:string):ElementSpecType => ['xsl:variable', {name,select}];
  xsl.t = (text:string):ElementSpecType => ['xsl:text',text];
  return xsl;
})();
