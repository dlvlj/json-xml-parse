# Transform JSON to XML

A library for fast JSON to XML transformations.

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
| typeHandler | function | null |

## Type Handling
```js
const typeHandler = (v) => [true, v]; // default
// triggered for every nested property in the JSON data
// first param -> Boolean for tag creation
// second param -> modified value
```

## Usage

```js
const parser = require('json-xml-parse');

const typeHandler = (v) => {
  switch(v) {
    case 'Earth': return [true, 'EARTH'];
    case 'mars': return [false];
    default: return [!!v, v] 
  }
}

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
  },
  typeHandler
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
          undefined,
          'Europa',
          'Deimos'
        ]
      }
    }
  }
}

const xml = parser.jsXml.toXmlString(data, options);
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