interface EntityMap {
  [key: string] : string
}
export interface InputData {
  [key: string] : any
}

export interface ToXmlProps {
  beautify: boolean
  entityMap: EntityMap
  selfClosing: boolean
  attrKey: string
  contentKey: string
}

export interface XmlTagProps {
  attributes: any
  level: number
  childTags: boolean
  content: any
}