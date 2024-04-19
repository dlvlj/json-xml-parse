# Transform JSON to XML

A library for lightning-fast JSON-to-XML transformations.

## Main Features

* Fast Conversion
* Dependency-Free
* CLI and Browser Support
* Lightweight

## Options (optional)

| Name | Type | Default
|---|---|---|
| beautify | boolean | false |
| attrKey | string | "@" |
| contentKey | string | "#" |
| declaration | object | `{ "version": "1.0" }` |
| entityMap | object | `{"<": "&lt;", ">": "&gt;"}` |

## Type Handling (optional)
```js
const typeHandler = (val) => [true, val]; // default
// triggered for every nested property in the JSON data
// first param -> to create tag or not
// second param -> to return modified data
```

## Usage

```js
const parser = require('json-xml-parse');

const options = {
  beautify: true,
  attrKey: "@",
  contentKey: "#",
  entityMap: {
    '"': "&#34;",
    "&": "&#38;"
  },
  declaration: {
    encoding:'US-ASCII',
    standalone: 'yes'
  }
}

const typeHandler = (val) => {
  if(val === 'earth') {
    return [!!val, 'EARTH']
  }
  return [!!val, val]
}

const data = {
  SolarSystem: {
    Galaxy: "\"MilkyWay\"",
    Star: () => "Sun",
    Planet: [
      {
        "position": "1",
        "name": "<Mercury>",
        "distance": "58",
      },
      {
        "position": "2",
        "name": "Venus",
        "distance": "108"
      }
    ],
    Planet1: {
      "@": {
        position: "3",
        distance: "149"
      },
      name: "Earth"
    },
    Planet2: {
    "@": {
      position: "4",
      distance: 227,
    },
    "#": {
        name: {
          "#" : 'mars',
          "@": {
            "has-water": 'true'
          },
        },
        moon: [
          'Phobos',
          'Europa',
          'Deimos'
        ]
      }
    }
  }
}

const xml = parser.jsXml.toXmlString(data, options, typeHandler);
```

```xml
<?xml version="1.0" encoding="US-ASCII" standalone="yes"?>
<SolarSystem>
 <Galaxy>&#34;MilkyWay&#34;</Galaxy>
 <Star>Sun</Star>
 <Planet>
  <position>1</position>
  <name>&lt;Mercury&gt;</name>
  <distance>58</distance>
 </Planet>
 <Planet>
  <position>2</position>
  <name>Venus</name>
  <distance>108</distance>
 </Planet>
 <Planet1 position="3" distance="149">
  <name>EARTH</name>
 </Planet1>
 <Planet2 position="4" distance="227">
  <name has-water="true">mars</name>
  <moon>Phobos</moon>
  <moon>Europa</moon>
  <moon>Deimos</moon>
 </Planet2>
</SolarSystem>
```
