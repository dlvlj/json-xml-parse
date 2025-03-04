interface TypeHandler {
  (data: any) : any
}
interface SetEntities {
  (data: string) : string
}
export interface InputData {
  [key: string] : any
}
export interface DeclarationData extends InputData {
  version?: "1.0" | "1.1";
  standalone?: "yes" | "no",
  encoding?: "UTF-8" | "UTF-16" | "US-ASCII" | "ISO-10646-UCS-2" | "ISO-10646-UCS-4"
    | "ISO-8859-1" | "ISO-8859-2" | "ISO-8859-3" | "ISO-8859-4" | "ISO-8859-5" | "ISO-8859-6" | "ISO-8859-7" | "ISO-8859-8" | "ISO-8859-9"
    | "ISO-2022-JP" | "Shift_JIS" | "EUC-JP" | string
}
export interface InputProps {
  beautify?: boolean
  entityMap?: InputData
  attrKey?: string
  contentKey?: string,
  declaration?: DeclarationData,
  typeHandler?: TypeHandler,
  selfClosing: boolean
}
export interface TagProps {
  name: string,
  attributes: any
  level: number
  hasChidTags: boolean
  content: any
  beautify: boolean,
  setEntities: SetEntities,
  selfClosing: boolean
}