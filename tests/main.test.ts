import * as parser from '../lib'

describe('json-xml-parse: toXmlString (default options)', () => {
  test('wraps a simple object in root tag with XML declaration', () => {
    const data = { Root: { Name: 'Alice' } };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<?xml version="1.0"?>');
    expect(xml).toContain('<Root>');
    expect(xml).toContain('<Name>Alice</Name>');
    expect(xml).toContain('</Root>');
  });

  test('escapes default entities (<, >, &, \', ")', () => {
    const data = { Root: { Value: `<tag> & "quoted" 'apos'` } };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('&lt;tag&gt;');
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&quot;quoted&quot;');
    expect(xml).toContain('&apos;apos&apos;');
    expect(xml).not.toContain('<tag>');
  });

  test('converts array values into repeated sibling tags', () => {
    const data = {
      Root: {
        Item: [{ id: '1' }, { id: '2' }, { id: '3' }],
      },
    };
    const xml = parser.jsXml.toXmlString(data);

    const matches = xml.match(/<Item>/g) || [];
    expect(matches.length).toBe(3);
    expect(xml).toContain('<id>1</id>');
    expect(xml).toContain('<id>2</id>');
    expect(xml).toContain('<id>3</id>');
  });

  test('renders function values by invoking them for their return value', () => {
    const data = { Root: { Star: () => 'Sun' } };
    const xml = parser.jsXml.toXmlString(data);
    console.log(xml)

    expect(xml).toContain('<Star>Sun</Star>');
  });

  test('uses default attrKey ("@") to render XML attributes', () => {
    const data = {
      Root: {
        Planet: {
          '@': { position: '3', distance: '149' },
          name: 'Earth',
        },
      },
    };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<Planet position="3" distance="149">');
    expect(xml).toContain('<name>Earth</name>');
  });

  test('uses default contentKey ("#") combined with attrKey for mixed nested content', () => {
    const data = {
      Root: {
        Item: {
          '@': { flag: 'true' },
          '#': { child: 'value' },
        },
      },
    };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<Item flag="true">');
    expect(xml).toContain('<child>value</child>');
    expect(xml).toContain('</Item>');
  });

  test('self-closes empty/undefined elements by default (selfClosing: true)', () => {
    const data = {
      Root: {
        Moon: [undefined, 'Europa'],
      },
    };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toMatch(/<Moon\s*\/>/);
    expect(xml).toContain('<Moon>Europa</Moon>');
  });
});

describe('json-xml-parse: toXmlString (custom options)', () => {
  test('respects a custom declaration object', () => {
    const data = { Root: { A: '1' } };
    const xml = parser.jsXml.toXmlString(data, {
      declaration: { version: '1.1', encoding: 'UTF-8' },
    });

    expect(xml).toContain('version="1.1"');
    expect(xml).toContain('encoding="UTF-8"');
  });

  test('respects custom attrKey and contentKey', () => {
    const data = {
      Root: {
        Item: {
          '$attrs': { id: '9' },
          '$body': { name: 'Widget' },
        },
      },
    };
    const xml = parser.jsXml.toXmlString(data, {
      attrKey: '$attrs',
      contentKey: '$body',
    });

    expect(xml).toContain('<Item id="9">');
    expect(xml).toContain('<name>Widget</name>');
  });

  test('typeHandler can suppress tags for empty/nullish values', () => {
    const data = {
      Root: {
        Galaxy: undefined,
        Star: () => null,
        Planet: 'Earth',
      },
    };
    const options = {
      typeHandler: (v: any) => {
        if ([undefined, null, ''].includes(v)) return [false, v];
        return [true, v];
      },
    };
    const xml = parser.jsXml.toXmlString(data, options);

    expect(xml).not.toContain('<Galaxy');
    expect(xml).not.toContain('<Star');
    expect(xml).toContain('<Planet>Earth</Planet>');
  });

  test('beautify: false produces output without added whitespace/newlines between tags', () => {
    const data = { Root: { A: '1', B: '2' } };
    const xmlBeautified = parser.jsXml.toXmlString(data, { beautify: true });
    const xmlCompact = parser.jsXml.toXmlString(data, { beautify: false });

    expect(xmlBeautified).toMatch(/\n/);
    expect(xmlCompact).not.toMatch(/\n\s+<A>/);
  });

  test('selfClosing: false renders empty elements as open/close pairs instead of self-closed', () => {
    const data = { Root: { Moon: [undefined] } };
    const xml = parser.jsXml.toXmlString(data, { selfClosing: false });

    expect(xml).not.toMatch(/<Moon\s*\/>/);
    expect(xml).toMatch(/<Moon><\/Moon>|<Moon>\s*<\/Moon>/);
  });

  test('custom entityMap overrides default character escaping', () => {
    const data = { Root: { Value: 'A & B' } };
    const xml = parser.jsXml.toXmlString(data, {
      entityMap: { '&': ' AND ' },
    });

    expect(xml).toContain('A AND B');
    expect(xml).not.toContain('&amp;');
  });
});

describe('json-xml-parse: edge cases', () => {
  test('handles deeply nested objects', () => {
    const data = {
      Root: {
        Level1: {
          Level2: {
            Level3: 'deep value',
          },
        },
      },
    };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<Level1>');
    expect(xml).toContain('<Level2>');
    expect(xml).toContain('<Level3>deep value</Level3>');
  });

  test('handles numeric values by converting them to text content', () => {
    const data = { Root: { Count: 42 } };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<Count>42</Count>');
  });

  test('handles boolean values by converting them to text content', () => {
    const data = { Root: { Active: true, Disabled: false } };
    const xml = parser.jsXml.toXmlString(data);

    expect(xml).toContain('<Active>true</Active>');
    expect(xml).toContain('<Disabled>false</Disabled>');
  });

  test('handles empty object gracefully (root tag only, no throw)', () => {
    expect(() => parser.jsXml.toXmlString({})).not.toThrow();
  });

  test('handles an array of primitive values under a single key', () => {
    const data = { Root: { Tag: ['a', 'b', 'c'] } };
    const xml = parser.jsXml.toXmlString(data);

    const matches = xml.match(/<Tag>[a-c]<\/Tag>/g) || [];
    expect(matches.length).toBe(3);
  });
});