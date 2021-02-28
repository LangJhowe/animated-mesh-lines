
import * as Monaco from 'monaco-editor'

/* monaco (官方文档https://microsoft.github.io/monaco-editor/index.html)
  official support language(https://github.com/microsoft/monaco-languages/tree/master/src)
   * monaco不支持自定义语言 标记 函数名颜色(预查正则无作用)
     - https://github.com/microsoft/monaco-editor/issues/993
*/
interface MonarchLanguageConfiguration extends Monaco.languages.IMonarchLanguage {
    keywords: string[];
}
interface IStandaloneThemeData extends Monaco.editor.IStandaloneThemeData {}

const typeKeywords = [
  'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float',
  'vec2', 'vec3', 'vec4'
]
// let regStr = `(?<=(${typeKeywords.join('|')})\\s+)\\w*`
// const functionReg = new RegExp(regStr, 'g')
Monaco.languages.register({ id: 'glsl' })
Monaco.languages.setMonarchTokensProvider('glsl', {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',
  keywords: [
    'abstract', 'continue', 'for', 'new', 'switch', 'assert', 'goto', 'do',
    'if', 'private', 'this', 'break', 'protected', 'throw', 'else', 'public',
    'enum', 'return', 'catch', 'try', 'interface', 'static', 'class',
    'finally', 'const', 'super', 'while', 'true', 'false'
  ],

  typeKeywords: typeKeywords,

  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%=', '<<=', '>>=', '>>>='
  ],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,
  digits: /(-?\d+)(\.)?(\d+)?/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  // function: /void aa/, // functionReg,
  // function: /(?<=(\w*)(void|float|vec3)\s+)\w*(?=([(=]|\s*))/, // functionReg,
  function: /(void|main|down)/, // functionReg,
  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@typeKeywords': 'typeKeywords',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      [/[A-Z][\w$]*/, 'type.identifier' ],  // to show class names nicely
      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/({|}|\(|\)|\[|\])/, 'brackets'], // [/[{}()[]]/, 'test']无效
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      } ],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [/@\s*[a-zA-Z_$][\w$]*/, { token: 'annotation', log: 'annotation token: $0' }],

      // numbers
      [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)/, 'number.hex'],
      [/0[oO]?(@octaldigits)/, 'number.octal'],
      [/0[bB](@binarydigits)/, 'number.binary'],
      [/(@digits)/, 'number'],
      // [/(@function)/, 'function']

      [/[:,;]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']


    ],
    common: [
    ],
    comment: [
      [/[^/*]+/, 'comment' ],
      [/\/\*/,    'comment', '@push' ],    // nested comment
      ['\\*/',    'comment', '@pop'  ],
      [/[/*]/,   'comment' ]
    ],

    string: [
      [/[^\\"]+/,  'string'],
      [/@escapes/, 'string.escape'],
      [/\\./,      'string.escape.invalid'],
      [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/,       'comment', '@comment' ],
      [/\/\/.*$/,    'comment']
    ]
  }
} as MonarchLanguageConfiguration)

Monaco.editor.defineTheme('glslTheme', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'test', foreground: 'ff8080' },
    { token: 'typeKeywords', foreground: 'C792EA' },
    { token: 'keyword', foreground: '7DDDFF' },
    { token: 'brackets', foreground: '7DDDFF' },
    { token: 'delimiter', foreground: '7DDDFF' },
    { token: 'number', foreground: 'D68C6C' },
    { token: 'function', foreground: 'FFA500' }
    // { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
    // { token: 'custom-warning', foreground: 'FFA500' }
  ]
} as IStandaloneThemeData)
