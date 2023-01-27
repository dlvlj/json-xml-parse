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

const parser = new Parser(options);

const xml = parser.toHTML(jsonData);

console.log(xml)