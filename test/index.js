const Parser = require('../dist');

const options = {
    indent: true,
    attrProp: '_attrs',
    txtProp: '_text',
    entityRefs: {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    },
    selfClosingTags: false
}

const jsonData = {
  'name': "Paul",
  'Age': '25',
  'Location': "USA",
  'Address':
     {
       "longitude": "-113.6335371",
       "latitude": "37.1049502",
       "postal-code": [
          'first',
          'second'
       ]
     }
}

const parser = new Parser(options);

const xml = parser.toXml(jsonData);

console.log(xml)