// See: https://stackoverflow.com/questions/75406721/npm-install-saxon-js-not-generating-d-ts-file
declare module "saxon-js" {
  /**
   * Exactly one of stylesheetLocation, stylesheetFileName, stylesheetText, or stylesheetInternal must be supplied.
   * Exactly one of sourceLocation, sourceFileName, sourceNode, or sourceText can be supplied.
   */
  export interface ITransformOptions {
    /**
     * A URI that can be used to locate the compiled stylesheet (a SEF file in JSON format).
     */
    stylesheetLocation?: string;

    /**
     * A file name that can be used to locate the compiled stylesheet (a JSON document).
     * Available in Node.js only. The filename, if relative, is resolved against the
     * current working directory.
     */
    stylesheetFileName?: string;

    /**
     * The JSON text content of the compiled stylesheet.
     */
    stylesheetText?: string;

    /**
     * This may be set to the JavaScript object that results from JSON-parsing of the SEF file.
     */
    stylesheetInternal?: object;

    /**
     * The static base URI of the stylesheet, as an absolute base URI.
     * Used, for example, by functions such as doc() or resolve-uri().
     */
    stylesheetBaseURI?: string;

    /**
     * Either "json" or "xml": used with sourceLocation, sourceFileName, or sourceText
     * to indicate whether the source is JSON or XML. Defaults to "xml".
     */
    sourceType?: string;

    /**
     * URI that can be used to locate the XML or JSON document.
     */
    sourceLocation?: string;

    /**
     * File name of the XML or JSON document. Available in Node.js only.
     * The filename, if relative, is resolved against the current working directory.
     */
    sourceFileName?: string;

    /**
     * The principal input as a DOM Node. This will normally be a Document or
     * DocumentFragment node, but any node is acceptable. (If it is not a
     * Document or DocumentFragment, then it will not match any match="/"
     * template rule.)
     */
    sourceNode?: Node;

    /**
     * Lexical XML or JSON supplying the source document.
     */
    sourceText?: string;

    /**
     * Absolute base URI for the source. The base URI of the source is automatically
     * set when supplied using sourceLocation or sourceFileName. This option can be
     * used to set the base URI for source supplied using sourceNode or sourceText,
     * as required.
     */
    sourceBaseURI?: string;

    /**
     * Determines what happens to the principal result tree from the transformation.
     * The default value is "application".
     */
    destination?:
      | "replaceBody"
      | "appendToBody"
      | "prependToBody"
      | "raw"
      | "document"
      | "application"
      | "file"
      | "stdout"
      | "serialized";

    /**
     * The meanings of the values are described under SaxonJS.XPath.evaluate().
     */
    resultForm?: "default" | "array" | "iterator" | "xdm";

    /**
     * Supplies additional serialization properties to be used when the principal
     * transformation result is serialized (if no serialization takes place, this
     * property is ignored). An example might be {method: "xml", indent: false}.
     */
    outputProperties?: object;

    /**
     * Applicable to Node.js only (in the browser, the HTML page always acts as the
     * master document). The master document is accessible within the transformation
     * using the extension function ixsl:page(). It can be updated in-situ by invoking
     * xsl:result-document with an appropriate method, or by using the extension
     * instructons ixsl:set-attribute or ixsl:remove-attribute.
     */
    masterDocument?: Node;

    /**
     * The Base Output URI for the transformation. Used to resolve relative URIs
     * appearing in the href attribute of xsl:result-document. In the browser, the
     * base output URI is always the URI of the HTML page (any other value is ignored).
     * In Node.js, the default is the URI of the principal output file for the
     * transformation; or failing that, the URI of the document supplied as
     * masterDocument.
     */
    baseOutputURI?: string;
  }

  export interface ITransformOutput {
    principalResult: any;
    resultDocuments: object;
    stylesheetInternal: object;
    masterDocument: Node;
  }

  export function transform(
    options: ITransformOptions,
    execution: "async" | "sync" | undefined
  ): Promise<ITransformOutput> | ITransformOutput;

  export function compile(
    params: { stylesheetNode: Document }
  ): object;
}
