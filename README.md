Transform JSON/JS to xml.
#### [Contribute](https://github.com/divijhardwaj/json-xml-parse) to make this project better.

##### Main Features
* Transform JSON to XML fast.
* Works with node packages, in browser, and in CLI.
* It can handle deeply nested JSON Objects.
* children/content property in JSON is not required for nesting tags. Any property in JSON which is not attribute property or value is treated as child tag.
* small package size.
* Options Available for customization
    * indent your xml data.
    * choose the **attribute** and **value** property(JSON) that contain attributes and value for a tag respectively.

## How to use

`$npm install json-xml-parse`

##### JSON/JS Object TO XML
```js
import { jsToXml } from 'json-xml-parse';

const options = {
    indent: true,
    attribute: '_attrs',
    value: '_value'
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
        '_value': 'Divij',
        '_attrs': {
          gender: 'male',
          age: 25
        }
      },
      family: {
        mother: () => "mother's name",
        father: {
          '_value': () => "father's name",
          '_attrs': {
            age: 50,
            gender: () => 'male'
          }
        },
        siblings: ''
      },
      ENTITIES: {
        LessThan: 'this < that',
        GreaterThan: 'this > that',
        Amp: 'something & something',
        Quot: '"Nice"',
        Apos: "Divij's Birthday"
      }
    }
  }
};

const xml = jsToXml(jsonData, options);
console.log(xml);
```

**OUTPUT**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2001/12/soap-envelope" SOAP-ENV:encodingStyle="http://www.w3.org/2001/12/soap-encoding">
  <SOAP-ENV:Body xmlns:m="http://www.xyz.org/quotations">
   <m:Person gender="male" age="25">Divij</m:Person>
   <family>
    <mother>mother&apos;s name</mother>
    <father age="50" gender="male">father&apos;s name</father>
    <siblings/>
   </family>
   <ENTITIES>
    <LessThan>this &lt; that</LessThan>
    <GreaterThan>this &gt; that</GreaterThan>
    <Amp>something &amp; something</Amp>
    <Quot>&quot;Nice&quot;</Quot>
    <Apos>Divij&apos;s Birthday</Apos>
   </ENTITIES>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

**Options**
* **indent**. Boolean. For indentation of transformed XML data.
* **attribute**. String. For picking attributes of tags from the JSON using the property name passed here.
* **value**. String. For picking value of tags from the JSON using the property name passed here.

**Limitations**
* Not tested with large JSON data.