interface Alias {
  attribute: string
  content: string
}

export interface JsonData {
  [key: string] : any
}

export interface Properties {
  beautify: boolean
  alias: Alias
  entityMap: JsonData
  selfClosing: boolean
}

export interface TagProps {
  attributes: any
  level: number
  childTags: boolean
  content: any
}