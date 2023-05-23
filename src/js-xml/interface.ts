interface Alias {
  attribute: string
  content: string
}

interface EntityMap {
  [key: string] : string
}
export interface InputData {
  [key: string] : any
}

export interface ToXmlProps {
  beautify: boolean
  alias: Alias
  entityMap: EntityMap
  selfClosing: boolean
}

export interface XmlTagProps {
  attributes: any
  level: number
  childTags: boolean
  content: any
}