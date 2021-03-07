Transform JSON/JS to xml.
#### [GitHub](https://github.com/divijhardwaj/json-xml-parse)

#### Main Features
* Transform JSON to XML fast.
* Works with node packages, in browser, and in CLI.
* It can handle deeply nested JSON Objects.
* children/content property in JSON is not required for nesting tags. Any property in JSON which is not attribute or value is treated as child tag.
* small package size.

## Installation

`$npm install json-xml-parse`

## How to use
```js
const parser = require('json-xml-parse');

const options = {
    indent: true,
    attrsNode: '_attrs',
    textNode: '_text',
    entities: {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    }
}

const jsonData = {
  'SOAP-ENV:Envelope': {
    '_attrs': {
      'xmlns:SOAP-ENV': 'http://www.w3.org/2001/12/soap-envelope',
      'SOAP-ENV:encodingStyle': 'http://www.w3.org/2001/12/soap-encoding'
    },
    'SOAP-ENV:Body': {
      '_attrs': {
        'xmlns:m': 'http://www.xyz.org/quotations'
      },
      'm:Person': {
        '_text': 'example',
        '_attrs': {
          gender: 'male',
          age: 1000
        }
      },
      family: {
        mother: () => "mother's name",
        father: {
          '_text': () => "father's name",
          '_attrs': {
            age: 50,
            gender: () => 'male'
          }
        },
        family: {
          mother: () => "mother's name",
          father: {
            '_text': () => "father's name",
            '_attrs': {
              age: 50,
              gender: () => 'male'
            }
          },
          family: {
            mother: () => "mother's name",
            father: {
              '_text': () => "father's name",
              '_attrs': {
                age: 50,
                gender: () => 'male'
              }
            },
            siblings: ''
          },
          siblings: ''
        },
        siblings: ''
      },
      ENTITIES: {
        LessThan: 'this < that',
        GreaterThan: 'this > that',
        Amp: 'conditon && something',
        Quot: '"Nice"',
        Apos: "Dave's"
      }
    }
  }
};

const xml = parser.toXml(jsonData, options);
```

**OUTPUT**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2001/12/soap-envelope" SOAP-ENV:encodingStyle="http://www.w3.org/2001/12/soap-encoding">
  <SOAP-ENV:Body xmlns:m="http://www.xyz.org/quotations">
   <m:Person gender="male" age="1000">example</m:Person>
   <family>
    <mother>mother&apos;s name</mother>
    <father age="50" gender="male">father&apos;s name</father>
    <family>
     <mother>mother&apos;s name</mother>
     <father age="50" gender="male">father&apos;s name</father>
     <family>
      <mother>mother&apos;s name</mother>
      <father age="50" gender="male">father&apos;s name</father>
      <siblings></siblings>
     </family>
     <siblings></siblings>
    </family>
    <siblings></siblings>
   </family>
   <ENTITIES>
    <LessThan>this &lt; that</LessThan>
    <GreaterThan>this &gt; that</GreaterThan>
    <Amp>conditon &amp;&amp; something</Amp>
    <Quot>&quot;Nice&quot;</Quot>
    <Apos>Dave&apos;s</Apos>
   </ENTITIES>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

**Options**
* **indent** - Boolean. For indentation of transformed XML String.
* **attrsNode** - String. For attributes of a tag.
* **textNode** - String. For text inside tag.
* **entities** - Object. For replacing entities. 