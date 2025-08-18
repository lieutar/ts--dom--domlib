import { describe, expect, test } from "vitest";
import { asDomlibDSL, asElement, isElementNode, newDocument, type ElementSpecType } from '@src/index';
import { JSDOM } from 'jsdom';

const window = new JSDOM().window;
const doc = newDocument(window);

describe('dsl', ()=>{
  describe('to-dom', ()=>{
    test('asElement', ()=>{
      const elem = asElement(doc, ['foo', {hoge: 'hoge-value'}]);
      expect(isElementNode(elem)).toBe(true);
    });
  });

  describe('to-dsl', ()=>{
    test('asDomlibDSL', ()=>{
      const dsl:ElementSpecType  = ['foo', {hoge: 'hoge-value'}, ['bar', ['bazz',{fuga: 'fuga-value'}, 'content']]];
      const elem = asElement(doc, dsl);
      expect(JSON.stringify(asDomlibDSL(elem)).toLowerCase()).toEqual(JSON.stringify(dsl));
    });
  });

});
