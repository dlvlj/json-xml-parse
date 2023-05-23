interface Alias {
  attribute: string
  content: string
}

interface EntityMap {
  [key: string] : string
}
export interface JsonData {
  [key: string] : any
}

export interface Properties {
  beautify: boolean
  alias: Alias
  entityMap: EntityMap
  selfClosing: boolean
}

export interface TagProps {
  attributes: any
  level: number
  childTags: boolean
  content: any
}