import { BaseEntity } from '../../../shared/types/base-entity'

export class Med extends BaseEntity {
  name: string
  uid: string
  desc?: string
}
