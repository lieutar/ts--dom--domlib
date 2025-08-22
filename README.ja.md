# domlib

Utilities for DOM manipulation.

## domlib DSL

``` typescript
const element = asElement(['ruby', {class: 'kanji'}, '漢字', ['rt', 'かんじ']]);
// makes <ruby class="kanji">漢字<rt>かんじ</rt></ruby>
```
