interface EntityMap {
  [key: string] : string
}
export interface InputData {
  [key: string] : any
}

export interface InputProps {
  beautify: boolean
  entityMap: EntityMap
  selfClosing: boolean
  attrKey: string
  contentKey: string
}

export interface TagProps {
  name: string,
  attributes: any
  level: number
  hasChidTags: boolean
  content: any
  setEntities: Function
  beautify: boolean
}