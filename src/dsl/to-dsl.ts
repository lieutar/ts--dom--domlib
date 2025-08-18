import { isDocumentFragmentNode, isDocumentNode, isElementNode, isTextNode, type AttributeSpecType, type FragmentSpecType, type NodeSpecType, type SingleNode } from "@src/types";
import { mapSiblings } from "@src/utils";

function dom2dsl(src:Node|null): NodeSpecType[]{
  if(!src) return [];
  if(isTextNode(src)) return src.textContent ? [src.textContent] : [];
  if(isDocumentNode(src)) return dom2dsl(src.documentElement);
  if(isElementNode(src)){
    const attrs: AttributeSpecType = {};
    let attrlen = 0;
    for(const attr of  src.getAttributeNames()){
      attrs[attr] = src.getAttribute(attr)!;
      attrlen++;
    }
    const children = mapSiblings(src.firstChild, dom2dsl).flat();
    return  [[src.tagName, ... (attrlen ? [attrs] : []), ... children as any]];
  }
  return [];
}

export function asDomlibDSL( src: null ): null;
export function asDomlibDSL( src: SingleNode ): NodeSpecType;
export function asDomlibDSL( src: DocumentFragment ): FragmentSpecType;
export function asDomlibDSL( src: SingleNode|DocumentFragment|null ): NodeSpecType | FragmentSpecType | null {
  if(!src) return null;
  if(!isDocumentFragmentNode(src)) return dom2dsl(src)[0]!;
  return mapSiblings(src.firstChild, dom2dsl).flat();
}
