import { isAttrSpecType, isCommentSpecType, isTextNode, isCommentNode, isElementNode,
  type AttributeSpecType, type CommentSpecType, type ElementSpecType, type NodeSpecType,
  type IWindow} from '../types';
import { newDocument, setAttributes } from '../utils';

export function asDocument ( window: IWindow, src:ElementSpecType ): Document{
  const doc = newDocument(window);
  const root = asElement( doc, src );
  while(doc.firstChild) doc.removeChild(doc.firstChild);
  doc.appendChild(root);
  return doc;
}

export function asElement ( doc : Document,  src :ElementSpecType ) : Element {
  if( isElementNode( src ) ) return doc.importNode(src) as Element;
  const [ elementName, attrs, content ]  = isAttrSpecType( src[1] ) ?
    [ src[0], src[1],                  src.slice(2) as NodeSpecType[] ]:
    [ src[0], {} as AttributeSpecType, src.slice(1) as NodeSpecType[] ];
  const elem = doc.createElement( elementName );
  setAttributes( elem, attrs );
  for ( const cspec of content ) elem.appendChild( asNode(doc, cspec) );
  return elem;
}

export function asNode ( doc: Document, src: NodeSpecType ) : Node{
  if( 'string' === typeof src ) return doc.createTextNode( src );
  //if( src instanceof Text ) return doc.importNode( src );
  if( isTextNode(src) ) return doc.importNode( src );
  if( isCommentSpecType(src) ) return asComment(doc, src);
  return asElement( doc, src );
}

export function asComment ( doc: Document, src: CommentSpecType) : Comment {
  if( isCommentNode( src ) ) return doc.importNode( src );
  return doc.createComment( src[1] ?? '' );
}

export function asFragment (
  doc: Document, ... srcs :NodeSpecType[]): DocumentFragment
{
  const R = doc.createDocumentFragment();
  for( const src of srcs ) R.appendChild( asNode(doc, src) );
  return R;
}

export function updateElement(
  elem: Element, attrs: AttributeSpecType, ... srcs: ElementSpecType[] )
{
  while(elem.firstChild) elem.removeChild( elem.firstChild );
  setAttributes( elem, attrs );
  elem.appendChild(asFragment(elem.ownerDocument, ... srcs ));
}
