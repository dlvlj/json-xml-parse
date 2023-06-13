export interface InputData {
  [key: string] : any
}
export interface InputProps {
  beautify: boolean
  entityMap: InputData
  selfClosing: boolean
  attrKey: string
  contentKey: string,
  declaration: InputData
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