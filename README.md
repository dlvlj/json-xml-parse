# Transform JSON to XML

A library for fast JSON to XML transformations.

## Main Features

* Fast Conversion
* Lightweight
* Dependency-Free
* CLI and Browser Support

## Options

| Name | Type | Default
|---|---|---|
| attrKey | str | "@" |
| contentKey | str | "#" |
| beautify | bool | true |
| selfClosing | bool | true |
| typeHandler | func | (v) => [true, v] |
| declaration | obj | `{ "version": "1.0" }` |
| entityMap | obj | `{ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;"}` |

## Usage

```js
const parser = require('json-xml-parse');

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

const xml = parser.jsXml.toXmlString(data);
```

```xml
<?xml version="1.0"?>
<SolarSystem>
 <Galaxy>&quot;MilkyWay&quot;</Galaxy>
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
  <name>Earth</name>
 </Planet1>
 <Planet2 position="4" distance="227">
  <name has-water="true">mars</name>
  <moon/>
  <moon>Europa</moon>
  <moon>Deimos</moon>
 </Planet2>
</SolarSystem>
```

## Type Handling

```js
const options = {
  typeHandler: (v) => [true, v]; 
  // return [<bool for creating tag>, <value>]
  // runs for every nested property
}
```

## Using Options

```js
const Options = {
  beautify: true,
  selfClosing: true,
  typeHandler: (v) => {
    if([undefined, null, ''].includes(v)) {
      return [false, v]
    }
    return [true, v]
  }
}

const data = {
  SolarSystem: {
    Galaxy: undefined,
    Star: () => null,
    Planet: 'Earth'
  }
}
const xml = parser.jsXml.toXmlString(data, Options);
```

```xml
<?xml version="1.0"?>
<SolarSystem>
 <Planet>Earth</Planet>
</SolarSystem>
```
