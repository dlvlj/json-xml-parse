## Transform JSON to xml

This is a library for converting JSON to XML and HTML.

## Installation

```sh
$npm install json-xml-parse 
```

## Main Features

* Converts JSON to XML and HTML fast.
* Works in CLI and Browser.
* Light weight.

## Options

| name | type |
|---|---|
| indent | Boolean |
| attrProp | String |
| txtProp | String |
| entityRefs | Object |
| selfClosingTags | Boolean |

## Functions

| name | params |
|---|---|
| toXml | json, xml declaration string(optional) |
| toHTML | json, html declaration string(optional) |

## Usage

```js
const Parser = require('json-xml-parse');

const options = {
  indent: true,
}

const data = {
  'name': "Paul",
  'Age': '25',
  'Location': "USA",
  'Address':
    {
      "longitude": "-113.6335371",
      "latitude": "37.1049502",
      "postal-code": "90266"
    }
};

const parser = new Parser(options);
const xml = parser.toXml(data);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<name>Paul</name>
<Age>25</Age>
<Location>USA</Location>
<Address>
  <longitude>-113.6335371</longitude>
  <latitude>37.1049502</latitude>
  <postal-code>90266</postal-code>
</Address>
```

## JSON to HTML

```js
const data = {
  html: {
    head: {
      title: 'sample title',
    },
    body: {
      div: {
        p: 'new text',
        a: 'click here'
      }
    }
  }
}
const html = parser.toHTML(data);
```

```html
<!DOCTYPE html>
<html>
  <head>
   <title>sample title</title>
  </head>
  <body>
   <div>
    <p>new text</p>
    <a>click here</a>
   </div>
  </body>
</html>
```

## Attributes and text

```js
const options = {
  indent: true,
  attrProp: '_attr',
  txtProp: '_text',
}

const data = {
  html: {
    head: {
      title: 'sample title',
    },
    body: {
      a: {
        _attr: {
          src: 'https://www.npmjs.com/'
        },
        _text:'click here',
        p: 'inside a'
      }
    }
  }
}

const parser = new Parser(options);
const html = parser.toHTML(data);
```

```html
<!DOCTYPE html>
<html>
  <head>
   <title>sample title</title>
  </head>
  <body>
   <a src="https://www.npmjs.com/">
    <p>inside a</p>
   </a>
  </body>
</html>
```

## Dynamic attributes and text

```js
{
  html: {
    head: {
      title: (msg = 'title') => 'sample ' + msg,
    },
    body: {
      a: {
        _attr: {
          src: (url = 'https://www.npmjs.com/') => url 
        },
        _text:(msg = 'click here') => msg,
        p: (msg = 'a') => 'inside ' + msg
      }
    }
  }
}
```

## Multiple tags with array

```js
{
  html: {
    head: {
      title: 'sample title',
    },
    body: {
      div: [
        {
          p: [
            'p1',
            'p2',
            {
              _text: 'p3',
              _attr: {
                class: 'text'
              }
            }
          ]
        },
        {
          _text: 'just text',
          _attr: {
            class: 'container'
          }
        }
      ]
    }
  }
}
```

```html
<!DOCTYPE html>
<html>
  <head>
   <title>sample title</title>
  </head>
  <body>
   <div>
    <p>p1</p>
    <p>p2</p>
    <p class="text">p3</p>
   </div>
   <div class="container">just text</div>
  </body>
</html>
```

## Entity

```js
const options = {
  indent: true,
  entityRefs: {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  }
}
const jsonData = {
  'name': "<Paul>",
  'Age': '2"5',
  'Location': "USA & Canada",
};
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<name>&lt;Paul&gt;</name>
<Age>2&quot;5</Age>
<Location>USA &amp; Canada</Location>
```

## Declaration option

```js
// html
parser.toHTML(data, '<!DOCTYPE html>');

// xml
parser.toXml(data, '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>');
```
