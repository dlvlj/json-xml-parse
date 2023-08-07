# Transform JSON to XML

This is a library for converting JSON to XML

## Main Features

* Converts JSON to XML and HTML fast.
* Works in CLI and Browser.
* Light weight.

## Options

| Name | Type | Default
|---|---|---|
| beautify | boolean | false |
| selfClosing | boolean | false |
| attrKey | string | "@" |
| contentKey | string | "#" |
| declaration | object | null |
| entityMap | object | null |

## Usage

```js
const parser = require('json-xml-parse');

const options = {
  beautify: true,
  selfClosing: true,
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

const data = {
  SolarSystem: {
    Galaxy: "\"MilkyWay\"",
    Star: () => "Sun",
    Planet: [
      {
        "position": "1",
        "name": "Mercury",
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
    "#": "Mars"
    }
  }
}

const xml = parser.jsXml.toXmlString(options,data);
```

```xml
<?xml version="1.0" encoding="US-ASCII" standalone="yes"?>
<SolarSystem>
	<Galaxy>&#34;MilkyWay&#34;</Galaxy>
	<Star>Sun</Star>
	<Planet>
		<position>1</position>
		<name>Mercury</name>
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
	<Planet2 position="4" distance="227">Mars</Planet2>
</SolarSystem>
```
