export type NodeSpecType = TextSpecType | ElementSpecType | CommentSpecType;
export type FragmentSpecType = NodeSpecType[] /* | DocumentFragment */;
export type TextSpecType = string | Text;
export type CommentSpecType = ['!--', string] | ['!--'] | Comment;
export type AttributeSpecType = { [attributeName: string]: string };
export type ElementSpecType = [string, AttributeSpecType, ... NodeSpecType[]]
                            | [string,  ... NodeSpecType[]] | Element;
export type ContainerDOMNode = Element | Document | DocumentFragment;
export type SingleNode = Exclude<Node, DocumentFragment>;

export function isNode(o:any) : o is Node {
  return o && (o.ownerDocument || o.nodeType === 9 ); }

export function isSingleNode(o:any) : o is SingleNode {
  return isNode(o) && !isDocumentFragmentNode(o); }

export function isElementNode(o:any) : o is Element {
  return o && o.ownerDocument && o.nodeType === o.ownerDocument.ELEMENT_NODE; }

export function isDocumentNode(o:any) : o is Document { return o && o.nodeType === 9; }

export function isDocumentFragmentNode(o:any) : o is DocumentFragment {
  return o && o.ownerDocument && o.nodeType === o.ownerDocument.DOCUMENT_FRAGMENT_NODE }

export function isContainerDOMNode(o: any) : o is ContainerDOMNode {
  return isElementNode(o) || isDocumentNode(o) || isDocumentFragmentNode(o)
}

export function isTextNode(o:any) : o is Text {
  return o && o.ownerDocument && o.nodeType === o.ownerDocument.TEXT_NODE; }

export function isCommentNode(o:any) : o is Comment {
  return o && o.ownerDocument && o.nodeType === o.ownerDocument.COMMENT_NODE; }


export function isTextSpecType ( o: any ) : o is TextSpecType {
  return ( 'string' === typeof o || isTextNode(o) ); }

export function isAttrSpecType ( o: any ) : o is AttributeSpecType {
  return 'object' === typeof o && o.constructor === Object; }

export function isCommentSpecType ( o: any ) : o is CommentSpecType {
  return isCommentNode(o) || Array.isArray(o) && o[0] === '!--'; }

export function isElementSpecType ( o: any ) : o is ElementSpecType {
  return isElementNode(o) || Array.isArray(o) && o[0] !== '!--'; }

export interface IWindow {
  DOMParser: typeof DOMParser;
  XPathResult: typeof XPathResult;
  XMLSerializer: typeof XMLSerializer;
  DOMImplementation: typeof DOMImplementation;
  // XSLTProcessor: typeof XSLTProcessor;
  document: Document;
}
